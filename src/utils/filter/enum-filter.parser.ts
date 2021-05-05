import { Property } from '../../Property'
import { FilterParser } from './filter.types'

export const EnumParser: FilterParser = {
  isParserForType: (filter) => (filter.property as Property).column.type === 'enum',
  parse: (filter, fieldKey) => ({ filterKey: fieldKey, filterValue: filter.value }),
}
