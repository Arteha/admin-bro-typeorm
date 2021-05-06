import { FilterParser } from './filter.types'
import { safeParseJSON } from './filter.utils'

export const JSONParser: FilterParser = {
  isParserForType: (filter) => ['boolean', 'number', 'float', 'object', 'array'].includes(
    filter.property.type(),
  ),
  parse: (filter, fieldKey) => ({
    filterKey: fieldKey,
    filterValue: safeParseJSON(filter.value as string),
  }),
}
