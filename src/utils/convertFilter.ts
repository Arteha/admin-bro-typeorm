import { BaseEntity, FindConditions, Between, MoreThanOrEqual, LessThanOrEqual, Like } from 'typeorm'
import { Filter } from 'adminjs'
import { Property } from '../Property'

function safeParseJSON(json: string) {
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export function convertFilter(filter?: Filter): FindConditions<BaseEntity> {
  if (!filter) return {}

  const { filters } = filter
  const where = {}
  for (const n in filters) {
    const one = filters[n]
    if (['boolean', 'number', 'float', 'object', 'array'].includes(one.property.type())) {
      where[n] = safeParseJSON(one.value as string)
    } else if (['date', 'datetime'].includes(one.property.type())) {
      if (typeof one.value !== 'string' && one.value.from && one.value.to) where[n] = Between(new Date(one.value.from), new Date(one.value.to))
      else if (typeof one.value !== 'string' && one.value.from) where[n] = MoreThanOrEqual(new Date(one.value.from))
      else if (typeof one.value !== 'string' && one.value.to) where[n] = LessThanOrEqual(new Date(one.value.to))
    } else if ((one.property as Property).column.type === 'enum') {
      where[n] = one.value
    } else if ((one.property as Property).type() === 'reference') {
      // when comes to reference TypeORM cannot filter by referenceId: YOUR_FILTER_VALUE
      // I don't know why. But it filters by an object: reference: {id: YOUR_FILTER_VALUE}
      // propertyPath holds `reference.id` that is why we split it by `.`
      const [column, key] = (one.property as Property).column.propertyPath.split('.')
      where[column] = {
        [key]: one.value,
      }
    } else {
      where[n] = Like(`%${one.value}%`)
    }
  }
  return where
}
