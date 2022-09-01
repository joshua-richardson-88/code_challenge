import { PrismaClient } from '@prisma/client'
import showData from './shows.json'
import packageData from './packages.json'

const prisma = new PrismaClient()

const networkMap = new Map<string, string>()

const addNetwork = async (title: string) => {
  const { id } = await prisma.network.create({ data: { title } })
  networkMap.set(title, id)

  return id
}
const getNetwork = async (title: string) =>
  networkMap.get(title) ?? (await addNetwork(title))

const seedShows = () => {
  showData.forEach(async ({ title, imdbRating, network }) => {
    const networkId = await getNetwork(network)

    await prisma.show.create({
      data: {
        title,
        imdbRating,
        networkId,
      },
    })
  })
}
const seedPackages = () => {
  packageData.forEach(async ({ name, networks, price }) => {
    const networkIds = await Promise.all(
      networks.map(async (n) => ({ id: await getNetwork(n) })),
    )

    await prisma.package.create({
      data: {
        name,
        price,
        networks: {
          connect: [...networkIds],
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
