import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { FilterParser } from './filter.types.js'

export const DateParser: FilterParser = {
  isParserForType: (filter) => ['date', 'datetime'].includes(filter.property.type()),
  parse: (filter, fieldKey) => {
    if (
      typeof filter.value !== 'string'
      && filter.value.from
      && filter.value.to
    ) {
      return {
        filterKey: fieldKey,
        filterValue: Between(
          new Date(filter.value.from),
          new Date(filter.value.to),
        ),
      }
    }
    if (typeof filter.value !== 'string' && filter.value.from) {
      return {
        filterKey: fieldKey,
        filterValue: MoreThanOrEqual(new Date(filter.value.from).toISOString()),
      }
    }
    if (typeof filter.value !== 'string' && filter.value.to) {
      return {
        filterKey: fieldKey,
        filterValue: LessThanOrEqual(new Date(filter.value.to)),
      }
    }

    throw new Error('Cannot parse date filter')
  },
}
