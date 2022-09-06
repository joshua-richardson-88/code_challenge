import type { NextFunction, Request, Response } from 'express'
import { env } from './config'

class AppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean
  errorMessage: string

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    this.errorMessage = message

    Error.captureStackTrace(this, this.constructor)
  }
}

const sendErrorDev = (err: AppError, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.errorMessage,
    })
  } else {
    console.error('ERROR: ', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    })
  }
}

const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next)

export { catchAsync, AppError }
export default function errorHandler() {
  return (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode ?? 500
    err.status = err.status ?? 'error'
    err.errorMessage = err.errorMessage ?? 'An error has occurred'

    env.NODE_ENV === 'development'
      ? sendErrorDev(err, res)
      : sendErrorProd(err, res)
  }
}
