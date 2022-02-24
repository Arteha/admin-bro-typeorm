import { Like } from 'typeorm'
import { FilterParser } from './filter.types'

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5|4|3|2|1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export const DefaultParser: FilterParser = {
  isParserForType: (filter) => filter.property.type() === 'string',
  parse: (filter, fieldKey) => {
    if (uuidRegex.test(filter.value.toString())) {
      return { filterKey: fieldKey, filterValue: filter.value }
    }
    return { filterKey: fieldKey, filterValue: Like(`%${filter.value}%`) }
  },
}
