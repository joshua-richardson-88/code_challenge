import express from 'express'
import type { Request, Response } from 'express'
import { foldW } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { of } from 'fp-ts/lib/Task'

import { AppError } from '../error-handlers'
import hasOwnProperty from '../utils/hasOwnProperty'
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
} from './helpers'

import type { ErrorMap } from '../utils/error-map'

const packageRouter = express.Router()

packageRouter.post('/', async (req: Request, res: Response) => {
  const p = await pipe(createPackage(req.body), foldW(of, of))()

  if (hasOwnProperty(p, 'code'))
    throw new AppError((p as ErrorMap).error, (p as ErrorMap).code)
  res.status(200).json(p)
})
packageRouter.put('/', async (req: Request, res: Response) => {
  const p = await pipe(updatePackage(req.body), foldW(of, of))()

  if (hasOwnProperty(p, 'code'))
    throw new AppError((p as ErrorMap).error, (p as ErrorMap).code)
  res.status(200).json(p)
})
packageRouter.delete('/:id', async (req: Request, res: Response) => {
  const p = await pipe(deletePackage(req.params.id), foldW(of, of))()

  if (hasOwnProperty(p, 'code'))
    throw new AppError((p as ErrorMap).error, (p as ErrorMap).code)
  res.sendStatus(201)
})
packageRouter.get('/', async (req: Request, res: Response) => {
  const p = await pipe(getPackages(req.params.id), foldW(of, of))()

  if (hasOwnProperty(p, 'code'))
    throw new AppError((p as ErrorMap).error, (p as ErrorMap).code)

  res.status(200).json(p)
})
packageRouter.get('/:id', async (req: Request, res: Response) => {
  const p = await pipe(getPackages(req.params.id), foldW(of, of))()

  if (hasOwnProperty(p, 'code'))
    throw new AppError((p as ErrorMap).error, (p as ErrorMap).code)

  res.status(200).json(p)
})

export default packageRouter
