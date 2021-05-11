/* eslint-disable no-restricted-globals */
const isNumeric = (value: null | string | number | undefined): boolean => {
  const stringValue = (String(value)).replace(/,/g, '.')

  if (isNaN(parseFloat(stringValue))) return false

  return isFinite(Number(stringValue))
}

const safeParseNumber = (value?: null | string | number): string | number | null | undefined => {
  if (isNumeric(value)) return Number(value)

  return value
}

export default safeParseNumber
