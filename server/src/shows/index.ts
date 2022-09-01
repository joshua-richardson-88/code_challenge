import express from 'express'
import type { Request, Response } from 'express'
import { foldW } from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { of } from 'fp-ts/lib/Task'

import { AppError } from '../error-handlers'
import hasOwnProperty from '../utils/hasOwnProperty'
import { createShow, deleteShow, getShows, updateShow } from './helpers'

const showRouter = express.Router()

showRouter.post('/', async (req: Request, res: Response) => {
  const show = await pipe(createShow(req.body), foldW(of, of))()

  if (hasOwnProperty(show, 'code')) throw new AppError(show.error, show.code)
  res.status(200).json(show)
})
showRouter.put('/', async (req: Request, res: Response) => {
  const show = await pipe(updateShow(req.body), foldW(of, of))()

  if (hasOwnProperty(show, 'code')) throw new AppError(show.error, show.code)
  res.status(200).json(JSON.stringify(show))
})
showRouter.delete('/', async (req: Request, res: Response) => {
  const show = await pipe(deleteShow(req.body), foldW(of, of))()

  if (hasOwnProperty(show, 'code')) throw new AppError(show.error, show.code)
  res.status(201)
})
showRouter.get('/', async (req: Request, res: Response) => {
  const shows = await pipe(getShows(req.params), foldW(of, of))()

  if (hasOwnProperty(shows, 'code')) throw new AppError(shows.error, shows.code)
  res.status(200).json(shows)
})

export default showRouter