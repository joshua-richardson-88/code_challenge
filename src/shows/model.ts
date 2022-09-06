import { z } from 'zod'

const showSchema = z.object({
  title: z.string(),
  network: z.string(),
  imdbRating: z.number(),
})
const updateShowInput = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    network: z.string().optional(),
    imdbRating: z.number().optional(),
  })
  .refine(
    (data) => !!data.title || !!data.imdbRating || !!data.network,
    'At least one field must be present to update',
  )
const getShowInput = z.object({
  network_id: z.string().optional(),
  package_id: z.string().optional(),
})

export type TShow = z.infer<typeof showSchema>
export type TUpdateInput = z.infer<typeof updateShowInput>
export type TGetInput = z.infer<typeof getShowInput>
export type DBShow = {
  id: string
  title: string
  imdbRating: number
  network: {
    id: string
    title: string
  }
}
export type DBPackageShow = {
  networks: {
    title: string
    id: string
    shows: {
      title: string
      imdbRating: number
      id: string
    }[]
  }[]
}

export { getShowInput, updateShowInput }
export default showSchema
