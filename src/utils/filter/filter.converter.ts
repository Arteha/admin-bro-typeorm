import { Filter } from 'adminjs'
import { BaseEntity, FindConditions } from 'typeorm'
import { DefaultParser } from './default-filter.parser'
import { parsers } from './filter.utils'

export const convertFilter = (
  filterObject?: Filter,
): FindConditions<BaseEntity> => {
  if (!filterObject) {
    return {}
  }

  const { filters } = filterObject ?? {}
  const where = {}

  Object.entries(filters ?? {}).forEach(([fieldKey, filter]) => {
    const parser = parsers.find((p) => p.isParserForType(filter))

    if (parser) {
      const { filterValue, filterKey } = parser.parse(filter, fieldKey)
      where[filterKey] = filterValue
    } else {
      const { filterValue, filterKey } = DefaultParser.parse(filter, fieldKey)
      where[filterKey] = filterValue
    }
  })

  return where
}
