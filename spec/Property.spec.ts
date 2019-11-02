import {expect} from 'chai'

import {Property} from '../src/Property'
import {Car} from './entities/Car'
import {connect, close} from './utils/testConnection'
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'

describe('Property', () => {
  let columns: Array<ColumnMetadata>
  
  before(async () => {
    await connect()
  })

  beforeEach(() => {
    columns = Car.getRepository().metadata.columns
  })

  after(async () => {
    await Car.delete({})
    close()
  })

  describe('#name', () => {
    it('returns a name of the property', () => {
      const column = columns.find(c => c.propertyName === 'id') as ColumnMetadata
      expect(new Property(column).name()).to.equal('id')
    })
  })

  describe('#path', () => {
    it('returns the path of the property', () => {
      const column = columns.find(c => c.propertyName === 'name') as ColumnMetadata
      expect(new Property(column).path()).to.equal('name')
    })

    it('returns the path of the property', () => {
      const column = columns.find(c => c.propertyName === 'carDealer') as ColumnMetadata
      expect(new Property(column).path()).to.equal('carDealerId')
    })
  })

  describe('#isId', () => {
    it('returns true for primary key', () => {
      const column = columns.find(c => c.propertyName === 'id') as ColumnMetadata
      expect(new Property(column).isId()).to.equal(true)
    })

    it('returns false for regular column', () => {
      const column = columns.find(c => c.propertyName === 'name') as ColumnMetadata
      expect(new Property(column).isId()).to.equal(false)
    })
  })

  describe('#reference', () => {
    it('returns the name of the referenced resource if any', () => {
      const column = columns.find(c => c.propertyName === 'carDealer') as ColumnMetadata
      expect(new Property(column).reference()).to.equal('CarDealer')
    })

    it('returns null for regular field', () => {
      const column = columns.find(c => c.propertyName === 'name') as ColumnMetadata
      expect(new Property(column).reference()).to.equal(null)
    })
  })

  describe('#availableValues', () => {
    it('returns null for regular field', () => {
      const column = columns.find(c => c.propertyName === 'name') as ColumnMetadata
      expect(new Property(column).availableValues()).to.equal(null)
    })

    it('returns available values when enum is given', () => {
      const column = columns.find(c => c.propertyName === 'carType') as ColumnMetadata
      expect(new Property(column).availableValues()).to.deep.equal([
        'modern', 'old', 'ghost'
      ])
    })
  })
})