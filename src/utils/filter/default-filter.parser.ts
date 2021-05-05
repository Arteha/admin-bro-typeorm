import { Like } from 'typeorm'
import { FilterParser } from './filter.types'

export const DefaultParser: FilterParser = {
  isParserForType: (filter) => filter.property.type() === 'string',
  parse: (filter, fieldKey) => ({ filterKey: fieldKey, filterValue: Like(`%${filter.value}%`) }),
}
