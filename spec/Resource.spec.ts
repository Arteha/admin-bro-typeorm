import { BaseProperty, BaseRecord, Filter, ValidationError } from 'adminjs'
import { expect } from 'chai'
import { validate } from 'class-validator'

import { Car } from './entities/Car.js'
import { CarDealer } from './entities/CarDealer.js'
import { dataSource } from './utils/test-data-source.js'

import { Resource } from '../src/Resource.js'
import { CarBuyer } from './entities/CarBuyer.js'

describe('Resource', () => {
  let resource: Resource
  const data = {
    model: 'Tucson',
    name: 'Hyundai',
    streetNumber: 'something',
    age: 4,
    stringAge: '4',
    'meta.title': 'Hyundai',
    'meta.description': 'Hyundai Tucson',
  }

  before(async () => {
    await dataSource.initialize()
  })

  beforeEach(async () => {
    resource = new Resource(Car)
    await Car.delete({})
    await CarDealer.delete({})
    await CarBuyer.delete({})
  })

  after(async () => {
    dataSource.destroy()
  })

  describe('.isAdapterFor', () => {
    it('returns true when Entity is give', () => {
      expect(Resource.isAdapterFor(Car)).to.equal(true)
    })

    it('returns false for any other kind of resources', () => {
      expect(Resource.isAdapterFor({ Car: true })).to.equal(false)
    })
  })

  describe('#databaseName', () => {
    it('returns correct database name', () => {
      expect(resource.databaseName()).to.equal(
        process.env.POSTGRES_DATABASE || 'database_test',
      )
    })
  })

  describe('#databaseType', () => {
    it('returns database dialect', () => {
      expect(resource.databaseType()).to.equal('postgres')
    })
  })

  describe('#name', () => {
    it('returns the name of the entity', () => {
      expect(resource.name()).to.equal('Car')
    })
  })

  describe('#properties', () => {
    it('returns all the properties', () => {
      expect(resource.properties()).to.have.lengthOf(12)
    })

    it('returns all properties with the correct position', () => {
      expect(resource.properties().map((property) => property.position())).to.deep.equal([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
      ])
    })
  })

  describe('#property', () => {
    it('returns selected property', () => {
      const property = resource.property('carId')

      expect(property).to.be.an.instanceOf(BaseProperty)
    })
  })

  describe('#find', () => {
    beforeEach(async () => {
      await resource.create(data)
      await resource.create({ ...data, name: 'other' })
    })

    it('returns all record when no query', async () => {
      const filter = new Filter({}, resource)
      return expect(await resource.find(filter, { sort: { sortBy: 'name' } })).to.have.lengthOf(2)
    })

    it('returns matched record when filter is provided', async () => {
      const filter = new Filter({ name: 'other' }, resource)
      return expect(await resource.find(filter, { sort: { sortBy: 'name' } })).to.have.lengthOf(1)
    })

    it('returns no records when filter does not match', async () => {
      const filter = new Filter({ name: 'others' }, resource)
      return expect(await resource.find(filter, { sort: { sortBy: 'name' } })).to.have.lengthOf(0)
    })
  })

  describe('#count', () => {
    it('returns number of records', async () => {
      expect(await resource.count({} as Filter)).to.eq(0)
    })
  })

  describe('#build flow with errors', () => {
    it('creates record with build flow', async () => {
      const record = await resource.build({
        ...data,
        age: 'someAge',
      })

      await record.save()

      // TODO handle undefined column
      expect(record.error('undefined')).not.to.equal(undefined)
    })
  })

  describe('#create', () => {
    it('returns params', async () => {
      const params = await resource.create(data)

      // eslint-disable-next-line no-unused-expressions
      expect(params.carId).not.to.be.undefined
    })

    it('stores Column with defined name property', async () => {
      const params = await resource.create(data)
      const reference: any = {}
      reference[resource.idName()] = params.carId
      const storedRecord: Car | null = await Car.findOneBy(reference)

      expect(storedRecord?.streetNumber).to.equal(data.streetNumber)
    })

    it('stores number Column with property as string', async () => {
      const params = await resource.create(data)
      const reference: any = {}
      reference[resource.idName()] = params.carId
      const storedRecord: Car | null = await Car.findOneBy(reference)

      expect(storedRecord?.stringAge).to.equal(4)
    })

    it('stores mixed type properties', async () => {
      const params = await resource.create(data)
      const reference: any = {}
      reference[resource.idName()] = params.carId
      const storedRecord: Car | null = await Car.findOneBy(reference)

      expect(storedRecord?.meta).to.deep.equal({
        title: data['meta.title'],
        description: data['meta.description'],
      })
    })

    it('throws ValidationError for defined validations', async () => {
      Resource.validate = validate
      try {
        await resource.create({
          model: 'Tucson',
          age: 200,
          stringAge: 'abc',
        })
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError)
        const errors = (error as ValidationError).propertyErrors
        expect(Object.keys(errors)).to.have.lengthOf(3)
        expect(errors.name.type).to.equal('isDefined')
        expect(errors.age.type).to.equal('max')
        expect(errors.stringAge.type).to.equal('max')
      }
      Resource.validate = undefined
    })

    it('throws ValidationError for missing "model" property', async () => {
      try {
        await resource.create({
          name: 'Tucson',
          age: 10,
          stringAge: '10',
        })
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError)
        const errors = (error as ValidationError).propertyErrors
        expect(Object.keys(errors)[0]).to.equal('model')
        expect(Object.keys(errors)).to.have.lengthOf(1)

        // eslint-disable-next-line no-unused-expressions
        expect(errors.model.message).not.to.be.null
      }
    })
  })

  describe('#update', () => {
    let record: BaseRecord | null

    beforeEach(async () => {
      const params = await resource.create({
        model: 'Tucson',
        name: 'Hyundai',
        age: 4,
        stringAge: '4',
      })
      record = await resource.findOne(params.carId)
    })

    it('updates record name', async () => {
      const ford = 'Ford'
      await resource.update((record && record.id()) as string, {
        name: ford,
      })
      const recordInDb = await resource.findOne((record && record.id()) as string)

      expect(recordInDb && recordInDb.get('name')).to.equal(ford)
    })

    it('throws error when wrong name is given', async () => {
      const age = 123131
      try {
        await resource.update((record && record.id()) as string, { age })
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError)
      }
    })
  })

  describe('references', () => {
    let carDealer: CarDealer
    let carBuyer: CarBuyer
    let carParams
    beforeEach(async () => {
      carDealer = CarDealer.create({ name: 'dealPimp' })
      await carDealer.save()

      carBuyer = CarBuyer.create({ name: 'johnDoe' })
      await carBuyer.save()
    })

    it('creates new resource', async () => {
      carParams = await resource.create({
        ...data,
        carDealerId: carDealer.id,
      })

      expect(carParams.carDealerId).to.equal(carDealer.id)
    })

    it('creates new resource with uuid', async () => {
      carParams = await resource.create({
        ...data,
        carBuyerId: carBuyer.carBuyerId,
      })

      expect(carParams.carBuyerId).to.equal(carBuyer.carBuyerId)
    })
  })

  describe('#delete', () => {
    let carDealer: CarDealer
    let carParams

    beforeEach(async () => {
      carDealer = CarDealer.create({ name: 'dealPimp' })
      await carDealer.save()
      carParams = await resource.create({ ...data, carDealerId: carDealer.id })
    })

    afterEach(async () => {
      await Car.delete(carParams.carId)
      await CarDealer.delete(carDealer.id)
    })

    it('deletes the resource', async () => {
      await resource.delete(carParams.carId)
      expect(await resource.count({} as Filter)).to.eq(0)
    })

    it('throws validation error when deleting record to which other record is related', async () => {
      const carDealerResource = new Resource(CarDealer)
      try {
        await carDealerResource.delete(carDealer.id)
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError)
        const { baseError } = error as ValidationError
        expect(baseError && baseError.type).to.equal('QueryFailedError')
        expect(baseError && baseError.message).not.to.equal(null)
      }
    })
  })
})
