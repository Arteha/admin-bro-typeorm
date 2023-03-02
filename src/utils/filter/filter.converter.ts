import { Filter } from 'adminjs'
import { BaseEntity, FindOptionsWhere } from 'typeorm'
import { DefaultParser } from './default-filter.parser.js'
import { parsers } from './filter.utils.js'

export const convertFilter = (
  filterObject?: Filter,
): FindOptionsWhere<BaseEntity> => {
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
