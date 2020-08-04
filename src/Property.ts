import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { BaseProperty, PropertyType } from 'admin-bro'
import { DATA_TYPES } from './utils/data-types'

export class Property extends BaseProperty {
  public column: ColumnMetadata;

  private columnPosition: number;

  constructor(column: ColumnMetadata, columnPosition = 0) {
    // for reference fields take database name (with ...Id)
    const path = column.referencedColumn ? column.databaseName : column.propertyPath
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
    let type: PropertyType | null = null
    if (typeof this.column.type === 'function') {
      if (this.column.type === Number) { type = 'number' }
      if (this.column.type === String) { type = 'string' }
      if (this.column.type === Date) { type = 'datetime' }
    } else { type = DATA_TYPES[this.column.type as any] }

    if (this.reference()) { return 'reference' }

    if (!type) { console.warn(`Unhandled type: ${this.column.type}`) }

    return type || 'string'
  }
}
