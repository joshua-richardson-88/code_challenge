import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import { env } from './config'
import errorHandler, { AppError } from './error-handlers'
import showRouter from './shows'
import packageRouter from './packages'
import swaggerDoc from './swagger.json'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/shows', showRouter)
app.use('/packages', packageRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.all('*', (req, _res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)),
)
app.use(errorHandler())

export default function serverStart() {
  app.listen(env.PORT, () => console.log(`Server is running on ${env.PORT}`))
}
