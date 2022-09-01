import { z } from 'zod'
import { left, right } from 'fp-ts/TaskEither'

import errorMap from './error-map'
const validator =
  <S extends z.ZodType>(schema: S) =>
  (data: unknown) => {
    const _validated = schema.safeParse(data)

    return _validated.success
      ? right(_validated.data as z.infer<typeof schema>)
      : left(errorMap(JSON.stringify(_validated.error.format()), 400))
  }

export default validator
