// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'
import { Application } from '@feathersjs/feathers'
import { ServiceTypes } from '../../../src/declarations'
import request from 'supertest'

describe('Calculate Service Tests', () => {
  it('registered the calculate service', () => {
    const service = app.service('calculate')

    assert.ok(service, 'Registered the service')
  })

  it('simplifies a valid algebraic expression', async () => {})

  it('Solve for 2x + 13 = 5 should return -4', async () => {
    const expression = '2x + 13 = 5'
    const service = app.service('calculate')

    const {
      result: { solution, steps }
    } = await service.create({ equation: expression })
    console.log('response from test', steps)

    assert.equal(solution, 'x = -4')
  })
})
