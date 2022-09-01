import { pipe } from 'fp-ts/lib/function'
import { chain, chainW, map, right, tryCatch } from 'fp-ts/lib/TaskEither'
import { PrismaClient } from '@prisma/client'

import validator from '../utils/validateRequest'
import { encode, decode } from '../utils/map-id'
import errorMap from '../utils/error-map'
import hasOwnProperty from '../utils/hasOwnProperty'
import showSchema, {
  DBPackageShow,
  deleteShowInput,
  getShowInput,
  updateShowInput,
} from './model'

import type {
  DBShow,
  TDeleteInput,
  TGetInput,
  TShow,
  TUpdateInput,
} from './model'

const prisma = new PrismaClient()

const maskId = (s: DBShow) => ({
  ...s,
  id: encode(s.id),
  network: {
    ...s.network,
    id: encode(s.network.id),
  },
})
// const maskIds = (ss: DBShow[]) => ss.map(maskId)
const maskIds = (ss: DBShow[] | DBPackageShow) => {
  if (hasOwnProperty(ss, 'networks')) {
    const dbShows: DBShow[] = []

    ;(ss as DBPackageShow).networks.forEach(({ id, title, shows }) => {
      dbShows.push(
        ...shows.map((show) => ({
          ...show,
          id: encode(show.id),
          network: {
            id: encode(id),
            title,
          },
        })),
      )
    })
    return dbShows
  }

  return (ss as DBShow[]).map(maskId)
}

const selectFromDB = {
  id: true,
  title: true,
  imdbRating: true,
  network: {
    select: {
      id: true,
      title: true,
    },
  },
}

const validatePost = validator(showSchema)
const validatePut = validator(updateShowInput)
const validateDelete = validator(deleteShowInput)
const validateGet = validator(getShowInput)

const saveToDB = async ({ title, network, imdbRating }: TShow) =>
  await prisma.show.create({
    data: {
      title,
      imdbRating,
      network: {
        connectOrCreate: {
          where: { title: network },
          create: { title: network },
        },
      },
    },
    select: selectFromDB,
  })
const updateDB = async ({ id, title, network, imdbRating }: TUpdateInput) => {
  if (network == null)
    return await prisma.show.update({
      where: { id },
      data: { title, imdbRating },
      select: selectFromDB,
    })

  return await prisma.show.update({
    where: { id },
    data: {
      title,
      imdbRating,
      network: {
        connectOrCreate: {
          where: { title: network },
          create: { title: network },
        },
      },
    },
    select: selectFromDB,
  })
}
const deleteFromDB = async ({ id }: TDeleteInput) =>
  await prisma.show.delete({ where: { id } })
const getFromDB = async ({ network_id, package_id, show_id }: TGetInput) => {
  if (show_id != null) {
    const show = await prisma.show.findUnique({
      where: { id: show_id },
      select: selectFromDB,
    })

    if (show == null) throw new Error('Show does not exist')
    return [show]
  }
  if (network_id != null) {
    return await prisma.show.findMany({
      where: { networkId: network_id },
      select: selectFromDB,
    })
  }
  if (package_id != null) {
    const dbPackage = await prisma.package.findUnique({
      where: { id: package_id as string },
      select: {
        networks: {
          select: {
            id: true,
            title: true,
            shows: {
              select: {
                id: true,
                title: true,
                imdbRating: true,
              },
            },
          },
        },
      },
    })
    if (dbPackage == null) throw new Error('Package does not exist')
    return dbPackage
  }
  return await prisma.show.findMany({
    select: selectFromDB,
  })
}

const createShow = (d: unknown) =>
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
const updateShow = (d: unknown) =>
  pipe(
    right(d),
    chain(validatePut),
    map((body) => ({
      ...body,
      id: decode(body.id),
    })),
    chainW((body) =>
      tryCatch(
        () => updateDB(body),
        () => errorMap('Database failure', 500),
      ),
    ),
    map(maskId),
  )
const deleteShow = (d: unknown) =>
  pipe(
    right(d),
    chain(validateDelete),
    chainW((body) =>
      tryCatch(
        () => deleteFromDB(body),
        () => errorMap('Database failure', 500),
      ),
    ),
  )
const getShows = (d: unknown) =>
  pipe(
    right(d),
    chain(validateGet),
    map((body) => ({
      network_id:
        typeof body.network_id === 'string'
          ? decode(body.network_id)
          : undefined,
      package_id:
        typeof body.package_id === 'string'
          ? decode(body.package_id)
          : undefined,
      show_id:
        typeof body.show_id === 'string' ? decode(body.show_id) : undefined,
    })),
    chainW((body) =>
      tryCatch(
        () => getFromDB(body),
        () => errorMap('Database failure', 500),
      ),
    ),
    map((body) => maskIds(body)),
  )

export { createShow, deleteShow, getShows, updateShow }
