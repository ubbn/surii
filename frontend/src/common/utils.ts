export const metaList = ['date', 'meta', 'pulses']
export const whiteList = [
  'närmar',
  'system',
  'hobby',
  'work',
  'read',
  'meditate',
  'household',
]
export const blackList = ['minutes']

export const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const isUndefNull = (value: any) => value === null || value === undefined

export const isNumeric = (value: any) => {
  if (isUndefNull(value) || isNaN(value)) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim() !== ''
  }

  return typeof +value === 'number' && typeof value === 'number'
}

// 123233 => 123'233
export const separate1000 = (n: number) =>
  `${n}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1'")

/**
 * Delete given key from given object and return new object
 *
 * @param obj js object
 * @param key key to delete from the object
 * @returns new object without the given key
 */
export const delKey = (obj: any, key: any) => {
  if (isUndefNull(obj)) {
    return undefined
  }
  if (!Object.keys(obj).includes(key)) {
    return obj
  }

  // eslint-disable-next-line
  const { [key]: ignoreThisValue, ...rest } = obj
  return rest
}
