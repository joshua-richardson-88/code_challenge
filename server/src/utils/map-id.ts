import HashIds from 'hashids'

const hashIds = new HashIds('this is my salt')

const encode = (id: string) => {
  const hex = Buffer.from(id).toString('hex')
  return hashIds.encodeHex(hex)
}
const decode = (id: string) => {
  const hex = hashIds.decodeHex(id)
  return Buffer.from(hex, 'hex').toString('ascii')
}

export { encode, decode }
