import { expect } from 'chai'

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata.js'
import { Property } from '../src/Property.js'
import { Car } from './entities/Car.js'
import { dataSource } from './utils/test-data-source.js'

describe('Property', () => {
  let columns: Array<ColumnMetadata>

  before(async () => {
    await dataSource.initialize()
  })

  beforeEach(() => {
    columns = Car.getRepository().metadata.columns
  })

  after(async () => {
    await Car.delete({})
    dataSource.destroy()
  })

  describe('#name', () => {
    it('returns a name of the property', () => {
      const column = columns.find((c) => c.propertyName === 'carId') as ColumnMetadata

      expect(new Property(column).name()).to.equal('carId')
    })
  })

  describe('#path', () => {
    it('returns the path of the property', () => {
      const column = columns.find((c) => c.propertyName === 'name') as ColumnMetadata

      expect(new Property(column).path()).to.equal('name')
    })

    it('returns the path of the property', () => {
      const column = columns.find((c) => c.propertyName === 'carDealerId') as ColumnMetadata

      expect(new Property(column).path()).to.equal('carDealerId')
    })
  })

  describe('#isId', () => {
    it('returns true for primary key', () => {
      const column = columns.find((c) => c.propertyName === 'carId') as ColumnMetadata

      expect(new Property(column).isId()).to.equal(true)
    })

    it('returns false for regular column', () => {
      const column = columns.find((c) => c.propertyName === 'name') as ColumnMetadata

      expect(new Property(column).isId()).to.equal(false)
    })
  })

  describe('#isEditable', () => {
    it('returns false for id field', async () => {
      const column = columns.find((c) => c.propertyName === 'carId') as ColumnMetadata

      expect(new Property(column).isEditable()).to.equal(false)
    })

    it('returns false for createdAt and updatedAt fields', async () => {
      const createdAt = columns.find((c) => c.propertyName === 'createdAt') as ColumnMetadata
      const updatedAt = columns.find((c) => c.propertyName === 'updatedAt') as ColumnMetadata

      expect(new Property(createdAt).isEditable()).to.equal(false)
      expect(new Property(updatedAt).isEditable()).to.equal(false)
    })

    it('returns true for a regular field', async () => {
      const column = columns.find((c) => c.propertyName === 'name') as ColumnMetadata

      expect(new Property(column).isEditable()).to.equal(true)
    })
  })

  describe('#reference', () => {
    it('returns the name of the referenced resource if any', () => {
      const column = columns.find((c) => c.propertyName === 'carDealerId') as ColumnMetadata

      expect(new Property(column).reference()).to.equal('CarDealer')
    })

    it('returns null for regular field', () => {
      const column = columns.find((c) => c.propertyName === 'name') as ColumnMetadata

      expect(new Property(column).reference()).to.equal(null)
    })
  })

  describe('#availableValues', () => {
    it('returns null for regular field', () => {
      const column = columns.find((c) => c.propertyName === 'name') as ColumnMetadata

      expect(new Property(column).availableValues()).to.equal(null)
    })

    it('returns available values when enum is given', () => {
      const column = columns.find((c) => c.propertyName === 'carType') as ColumnMetadata

      expect(new Property(column).availableValues()).to.deep.equal([
        'modern', 'old', 'ghost',
      ])
    })
  })

  describe('#type', () => {
    it('returns mixed type for an jsonb property', () => {
      const column = columns.find((c) => c.propertyName === 'meta') as ColumnMetadata

      expect(new Property(column).type()).to.equal('mixed')
    })
  })
})
