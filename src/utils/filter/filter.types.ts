import { FilterElement } from 'adminjs'
import { FindManyOptions } from 'typeorm'

export type FilterParser = {
  isParserForType: (filter: FilterElement) => boolean;
  parse: (
    filter: FilterElement,
    fieldKey: string
  ) => { filterKey: string; filterValue: FindManyOptions['where'] };
};
