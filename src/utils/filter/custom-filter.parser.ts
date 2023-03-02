import { FilterParser } from './filter.types.js'

/**
 * It wasn't possible to pass raw filters to adapters with AdminJS
 * This solution allows you to pass custom filters to typeorm adapter modyfing list handler
 *
 * In your custom list handler modify creating filters in this way:
 *
 * ```
 * // That makes `Filter` class to create proper filter object.
 * filters[propertyToFilterBy] = 1;
 * const filter = await new Filter(filters, resource).populate();
 * // This parser recognizes `custom` field and passes the value directly to typeorm
 * filter.filters[propertyToFilterBy].custom = In([1,2,3]);
 *
 */
export const CustomParser: FilterParser = {
  isParserForType: (filter) => (filter as any)?.custom,
  parse: (filter, fieldKey) => ({
    filterKey: fieldKey,
    filterValue: (filter as any)?.custom,
  }),
}
