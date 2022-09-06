import { z } from 'zod'

const addPackageInput = z.object({
  name: z.string(),
  price: z.number(),
  network: z.string(),
})
const updatePackageInput = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    price: z.number().optional(),
    network: z.string().optional(),
  })
  .refine(
    (data) => !!data.name || !!data.price || !!data.network,
    'At least one field must be present to update',
  )

export type TAddInput = z.infer<typeof addPackageInput>
export type TUpdateInput = z.infer<typeof updatePackageInput>
export type DBPackage = {
  id: string
  name: string
  price: number
  networks: {
    id: string
    title: string
  }[]
}

export { updatePackageInput, addPackageInput }
