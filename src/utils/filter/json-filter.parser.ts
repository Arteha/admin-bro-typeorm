import { FilterParser } from './filter.types.js'
import { safeParseJSON } from './filter.utils.js'

export const JSONParser: FilterParser = {
  isParserForType: (filter) => ['boolean', 'number', 'float', 'object', 'array'].includes(
    filter.property.type(),
  ),
  parse: (filter, fieldKey) => ({
    filterKey: fieldKey,
    filterValue: safeParseJSON(filter.value as string),
  }),
}
