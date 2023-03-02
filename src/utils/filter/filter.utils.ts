import { CustomParser } from './custom-filter.parser.js'
import { DateParser } from './date-filter.parser.js'
import { EnumParser } from './enum-filter.parser.js'
import { JSONParser } from './json-filter.parser.js'
import { ReferenceParser } from './reference-filter.parser.js'

export const safeParseJSON = (json: string): any | null => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export const parsers = [
  // Has to be the first one, as it is intended to use custom filter if user overrides that
  CustomParser,
  DateParser,
  EnumParser,
  ReferenceParser,
  JSONParser,
]
