import { Property } from '../../Property.js'
import { FilterParser } from './filter.types.js'

export const EnumParser: FilterParser = {
  isParserForType: (filter) => (filter.property as Property).column.type === 'enum',
  parse: (filter, fieldKey) => ({
    filterKey: fieldKey,
    filterValue: filter.value,
  }),
}
