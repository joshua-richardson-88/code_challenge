import { PrismaClient } from '@prisma/client'
import showData from './shows.json'
import packageData from './packages.json'

const prisma = new PrismaClient()

const seedShows = () => {
  showData.forEach(async ({ title, imdbRating, network }) => {
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
    })
  })
}
const seedPackages = () => {
  packageData.forEach(async ({ name, networks, price }) => {
    await prisma.package.create({
      data: {
        name,
        price,
        networks: {
          connectOrCreate: networks.map((title) => ({
            where: { title },
            create: { title },
          })),
        },
      },
    })
  })
}

const main = async () => {
  seedShows()
  seedPackages()
}

main()
