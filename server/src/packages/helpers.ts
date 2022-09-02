import { pipe } from 'fp-ts/lib/function'
import { chain, chainW, left, map, right, tryCatch } from 'fp-ts/lib/TaskEither'
import { PrismaClient } from '@prisma/client'

import validator from '../utils/validateRequest'
import { encode, decode } from '../utils/map-id'
import errorMap from '../utils/error-map'
import { addPackageInput, updatePackageInput } from './model'

import type { DBPackage, TAddInput, TUpdateInput } from './model'

const prisma = new PrismaClient()
const maskId = (p: DBPackage) => ({
  ...p,
  id: encode(p.id),
  networks: p.networks.map((n) => ({
    ...n,
    id: encode(n.id),
  })),
})
const validatePost = validator(addPackageInput)
const validatePut = validator(updatePackageInput)
const validateDelete = (id: unknown) => {
  if (typeof id === 'string') return right(decode(id))
  return left(errorMap('id must exist', 400))
}
const validateGet = (id: unknown) => {
  if (typeof id === 'string') return right(decode(id))
  return right(undefined)
}
const selectFromDB = {
  id: true,
  name: true,
  price: true,
  networks: {
    select: {
      id: true,
      title: true,
    },
  },
}

const saveToDB = async ({ name, network, price }: TAddInput) =>
  await prisma.package.create({
    data: {
      name,
      price,
      networks: {
        connectOrCreate: {
          where: { title: network },
          create: { title: network },
        },
      },
    },
    select: selectFromDB,
  })
const updateDB = async ({ id, name, price, network }: TUpdateInput) => {
  if (network == null)
    return await prisma.package.update({
      where: { id },
      data: { name, price },
      select: selectFromDB,
    })
  return await prisma.package.update({
    where: { id },
    data: {
      name,
      price,
      networks: {
        connectOrCreate: {
          where: { title: network },
          create: { title: network },
        },
      },
    },
    select: selectFromDB,
  })
}
const deleteFromDB = async (id: string) =>
  await prisma.package.delete({ where: { id } })
const getFromDB = async (id?: string) => {
  if (id != null) {
    const dbPackage = await prisma.package.findUnique({
      where: { id },
      select: selectFromDB,
    })
    if (dbPackage == null) throw new Error('Package does not exist')
    return [dbPackage]
  }
  return await prisma.package.findMany({ select: selectFromDB })
}

const createPackage = (d: unknown) =>
  pipe(
    right(d),
    chain(validatePost),
    chainW((body) =>
      tryCatch(
        () => saveToDB(body),
        () => errorMap('Database failure', 500),
      ),
    ),
    map(maskId),
  )
const updatePackage = (d: unknown) =>
  pipe(
    right(d),
    chain(validatePut),
    chainW((body) =>
      tryCatch(
        () => updateDB(body),
        () => errorMap('Database failure', 500),
      ),
    ),
    map(maskId),
  )
const deletePackage = (d: unknown) =>
  pipe(
    right(d),
    chain(validateDelete),
    chainW((id) =>
      tryCatch(
        () => deleteFromDB(id),
        () => errorMap('Database failure', 500),
      ),
    ),
  )
const getPackages = (d: unknown) =>
  pipe(
    right(d),
    chain(validateGet),
    chainW((id) =>
      tryCatch(
        () => getFromDB(id),
        () => errorMap('Database failure', 500),
      ),
    ),
    map((res) => res.map(maskId)),
  )

export { createPackage, deletePackage, getPackages, updatePackage }
