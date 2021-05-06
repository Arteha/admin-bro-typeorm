import { FilterElement } from 'admin-bro'
import { FindManyOptions } from 'typeorm'

export type FilterParser = {
  isParserForType: (filter: FilterElement) => boolean;
  parse: (
    filter: FilterElement,
    fieldKey: string
  ) => { filterKey: string; filterValue: FindManyOptions['where'] };
};
