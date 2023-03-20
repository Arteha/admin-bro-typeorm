import { BaseProperty, PropertyType } from 'adminjs'
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata.js'
import { DATA_TYPES } from './utils/data-types.js'

export class Property extends BaseProperty {
  public column: ColumnMetadata

  private columnPosition: number

  constructor(column: ColumnMetadata, columnPosition = 0) {
    const path = column.propertyPath
    super({ path })
    this.column = column
    this.columnPosition = columnPosition
  }

  public isEditable(): boolean {
    return !this.isId()
      && !this.column.isCreateDate
      && !this.column.isUpdateDate
  }

  public isId(): boolean {
    return this.column.isPrimary
  }

  public isSortable(): boolean {
    return this.type() !== 'reference'
  }

  public reference(): string | null {
    const ref = this.column.referencedColumn
    if (ref) return ref.entityMetadata.name
    return null
  }

  public availableValues(): Array<any> | null {
    const values = this.column.enum
    if (values) { return values.map((val) => val.toString()) }
    return null
  }

  public position(): number {
    return this.columnPosition || 0
  }

  public type(): PropertyType {
    let type: PropertyType = DATA_TYPES[this.column.type as any]

    if (typeof this.column.type === 'function') {
      if (this.column.type === Number) { type = 'number' }
      if (this.column.type === String) { type = 'string' }
      if (this.column.type === Date) { type = 'datetime' }
      if (this.column.type === Boolean) { type = 'boolean' }
    }

    if (this.reference()) { type = 'reference' }

    // eslint-disable-next-line no-console
    if (!type) { console.warn(`Unhandled type: ${this.column.type}`) }

    return type
  }

  public isArray(): boolean {
    return this.column.isArray
  }
}
