import express, { response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config'
import errorHandler, { AppError } from './error-handlers'

import type { Request, Response, NextFunction } from 'express'
import showRouter from './shows'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

/*
  CRUD:
    Shows Router
      CREATE: (title: string, network: string, imdbRating: number) => Show
      UPDATE: (id: string, title?: string, network?: string, imdbRating?: number) => Show
      DELETE: (id: string) => void
      GET: (id?: string, networkID?: string, packageID? string) => Show[]
    Packages Router
      CREATE: (name: string, price: number, networks: Network[]) => Package
      UPDATE: (id: string, name?: string, price?: number, networks?: Network[]) => Package
      DELETE: (id: string) => void
      GET: (id?: string) => Package[]
    Networks Router
      CREATE: (title: string) => Network
      UPDATE: (id: string, title: string) => Network
      DELETE: (id: string) => void
      GET: (id?: string, title?: string) => Network
*/
app.use('/shows', showRouter)

app.all('*', (req, _res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)),
)
app.use(errorHandler())

export default function serverStart() {
  app.listen(env.PORT, () => console.log(`Server is running on ${env.PORT}`))
}
