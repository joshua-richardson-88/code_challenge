import serverStart from './server'

process.on('uncaughtException', (error) => {
  console.error(error.name, error.message)
  console.error('Uncaught exception! Shutting down...')
  process.exit(1)
})
process.on('unhandledRejection', (error) => {
  console.error(error)
  console.log('Unhandled Rejection! Shutting down...')
  process.exit(1)
})

serverStart()
