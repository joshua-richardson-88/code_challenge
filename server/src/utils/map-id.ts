const encode = (id: string) => Buffer.from(id).toString('base64url')
const decode = (b64: string) => Buffer.from(b64).toString('ascii')

export { encode, decode }
