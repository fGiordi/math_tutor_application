// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { Application } from '@feathersjs/feathers'
import { ServiceTypes } from '../../../src/declarations'
describe('calculate service', () => {
  let server: any
  let client: Application<ServiceTypes>

  it('registered the service', () => {
    const service = app.service('calculate')

    assert.ok(service, 'Registered the service')
  })

  it('simplifies a valid algebraic expression', async () => {})
})
