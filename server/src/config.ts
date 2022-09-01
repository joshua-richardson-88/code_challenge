import { z } from 'zod'
import type { ZodFormattedError } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.string().default('8080'),
})
export const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value)
        return `${name}: ${value._errors.join(', ')}\n`
    })
    .filter(Boolean)

const _serverEnv = serverSchema.safeParse(process.env)

if (!_serverEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_serverEnv.error.format()),
  )
  throw new Error('Invalid environment variables')
}

export const env = { ..._serverEnv.data, PORT: +_serverEnv.data.PORT }
