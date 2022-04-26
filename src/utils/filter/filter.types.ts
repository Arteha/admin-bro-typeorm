import { FilterElement } from 'adminjs'

export type FilterParser = {
  isParserForType: (filter: FilterElement) => boolean;
  parse: (
    filter: FilterElement,
    fieldKey: string
  ) => { filterKey: string; filterValue: any };
};
