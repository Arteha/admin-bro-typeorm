import { Like, Raw } from 'typeorm'
import { Property } from '../../Property.js'
import { FilterParser } from './filter.types.js'

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5|4|3|2|1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export const DefaultParser: FilterParser = {
  isParserForType: (filter) => filter.property.type() === 'string',
  parse: (filter, fieldKey) => {
    if (
      uuidRegex.test(filter.value.toString())
      || (filter.property as Property).column.type === 'uuid'
    ) {
      return {
        filterKey: fieldKey,
        filterValue: Raw((alias) => `CAST(${alias} AS CHAR(36)) = :value`, {
          value: filter.value,
        }),
      }
    }
    return { filterKey: fieldKey, filterValue: Like(`%${filter.value}%`) }
  },
}
