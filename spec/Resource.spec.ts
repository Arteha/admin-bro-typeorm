import {expect} from 'chai'

import {Resource} from '../src/Resource'
import {Car} from './entities/Car'
import {connect, close} from './utils/testConnection'
import { BaseProperty, BaseRecord, ValidationError } from 'admin-bro'
import { validate } from 'class-validator'
import { CarDealer } from './entities/CarDealer'

describe('Resource', () => {
  let resource: Resource
  let data = {
    model: 'Tucson',
    name: 'Hyundai',
    streetNumber: 'something',
    age: 4
  }
  
  before(async () => {
    await connect()
  })

  beforeEach(() => {
    resource = new Resource(Car)
  })

  after(async () => {
    await Car.delete({})
    close()
  })

  describe('.isAdapterFor', () => {
    it('returns true when Entity is give', () => {
      expect(Resource.isAdapterFor(Car)).to.equal(true)
    })

    it('returns flalse for any other kind of resources', () => {
      expect(Resource.isAdapterFor({"Car": true})).to.equal(false)
    })
  })

  describe('#databaseName', () => {
    it('returns correct database name', () => {
      expect(resource.databaseName()).to.equal(process.env.POSTGRES_DATABASE)
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
      expect(resource.properties()).to.have.lengthOf(9)
    })
  })

  describe('#property', () => {
    it('returns selected property', () => {
      const property = resource.property('id')
      expect(property).to.be.an.instanceOf(BaseProperty)
    })
  })

  describe('#count', () => {
    it('returns number of records', async () => {
      expect(await resource.count({})).to.eq(0)
    })
  })

  describe('#build flow with errors', () => {
    it('creates record with build flow', async () => {
      let record = await resource.build({
        ...data,
        age: 'asdasd'
      })
      await record.save()
      // TODO handle undefined column
      expect(record.error('undefined')).not.to.equal(undefined)
    })
  })

  describe('#create', () => {
    let record: BaseRecord
    
    afterEach(async () => {
      record && await resource.delete(record.id())
    })

    it('returns params', async () => {
      const params = await resource.create(data)
      expect(params.id).not.to.be.undefined
    })

    it('stores Column with defined name property', async () => {
      const params = await resource.create(data)
      // console.log(resource.properties())
      const storedRecord = await Car.findOne(params.id) as Car
      expect(storedRecord.streetNumber).to.equal(data.streetNumber)
    })

    it('throws ValidationError for defined validations', async () => {
      Resource.validate = validate
      try {
        await resource.create({
          model: 'Tucson',
          age: 200
        })
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError)
        const errors = (error as ValidationError).errors
        expect(Object.keys(errors)).to.have.lengthOf(2)
        expect(errors['name'].type).to.equal('isDefined')
        expect(errors['age'].type).to.equal('max')
      }
      Resource.validate = undefined
    })

    it('throws ValidationError for missing "model" property', async () => {
      try {
        await resource.create({
          name: 'Tucson',
          age: 10
        })
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError)
        const errors = (error as ValidationError).errors
        expect(Object.keys(errors)[0]).to.equal('model')
        expect(Object.keys(errors)).to.have.lengthOf(1)
        expect(errors['model'].message).not.to.be.null
      }
    })
  })

  describe('#update', () => {
    let record: BaseRecord
    
    beforeEach(async () => {
      const params = await resource.create({
        model: 'Tucson',
        name: 'Hyundai',
        age: 4
      })
      record = await resource.findOne(params.id)
    })

    afterEach(async () => {
      record && await resource.delete(record.id())
    })

    it('updates record name', async () => {
      const ford = "Ford"
      await resource.update(record.id(), {
        name: ford
      })
      const recordInDb = await resource.findOne(record.id())
      
      expect(recordInDb.param('name')).to.equal(ford)
    })

    it('throws error when wrong name is given', async () => {
      const age = 123131
      try {
        await resource.update(record.id(), { age })
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError)
      }
    })
  })

  describe('references', () => {
    let carDealer: CarDealer
    let carParams
    beforeEach(async () => {
      carDealer = CarDealer.create({ name: 'dealPimp' })
      await carDealer.save()
    })

    afterEach(async () => {
      carParams && await resource.delete(carParams.id)
      carDealer && await CarDealer.delete(carDealer)
    })

    it('creates new resource', async () => {
      carParams = await resource.create({
        ...data,
        'carDealer.id': carDealer.id
      })
      
      expect(carParams.carDealerId).to.equal(carDealer.id)
    })
  })
})