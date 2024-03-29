// Retrieve options
export const getOptions = ({ key = DEFAULT_KEY } = {}) => {
  validateKey(key)
  return { key }
}

const validateKey = (key) => {
  if (typeof key !== 'string' && typeof key !== 'symbol') {
    throw new TypeError(`The "key" option must be a string or a symbol`)
  }
}

const DEFAULT_KEY = '_merge'
