import { expect } from 'chai'

import { connection, connect, close } from './utils/testConnection'
import { Database } from '../src/Database'

describe('Database', () => {
  before(async () => {
    await connect()
  })

  after(() => { close() })

  describe('.isAdapterFor', () => {
    it('returns true when typeorm connection is given', () => {
      expect(Database.isAdapterFor(connection)).to.equal(true)
    })
    it('returns false for any other data', () => {
      expect(Database.isAdapterFor({})).to.equal(false)
    })
  })

  describe('#resources', () => {
    it('returns all entities', async () => {
      expect(new Database(connection).resources()).to.have.lengthOf(2)
    })
  })
})
