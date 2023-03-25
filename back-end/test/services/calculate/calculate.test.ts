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
  //
  it('Solve for 2x + 13 = 5 should return -4', async () => {
    const expression = '2x + 13 = 5'
    const service = app.service('calculate')

    const {
      result: { solution, steps }
    } = await service.create({ equation: expression })
    console.log('response from test', steps)

    assert.equal(solution, 'x = -4')
    assert.deepStrictEqual(steps, [
      'Original equation: 2x + 13 = 5',
      'Simplify LHS: 2x + 13',
      'Simplify RHS: 5',
      'Move all variable terms to LHS: 2x',
      'Move all constant terms to RHS: 5  - 13',
      'Add 13 to both sides: 2x + 13  - 13 = 5  - 13 ',
      'Simplify and divide both sides by the factor: 2x = -8',
      'Solution: x = -4'
    ])
  })

  it('Solve 3x + 2 = 9 - 4x should return 1', async () => {
    const expression = '3x + 2 = 9 - 4x'
    const service = app.service('calculate')

    const {
      result: { solution, steps }
    } = await service.create({ equation: expression })

    assert.equal(solution, 'x = 1')
    assert.deepStrictEqual(steps, [
      'Original equation: 3x + 2 = 9 - 4x',
      'Simplify LHS: 3x + 2',
      'Simplify RHS: 9 - 4x',
      'Move all variable terms to LHS: 3x  + 4x',
      'Move all constant terms to RHS: 9   - 2   ',
      'Add the liked terms on LHS: 1. 3x   + 4x  = 7x',
      'Add the liked terms on RHS: 2: 9  - 2  = 7  ',
      'Simplify and divide both sides by the factor: 7x = 7 ',
      'Solution: x = 1'
    ])
  })

  it('Solve 4x + 12 = 2x should return - 6', async () => {
    const expression = '4x + 12 = 2x'
    const service = app.service('calculate')

    const {
      result: { solution, steps }
    } = await service.create({ equation: expression })

    assert.equal(solution, 'x = -6')
    assert.deepStrictEqual(steps, [
      'Original equation: 4x + 12 = 2x',
      'Simplify LHS: 4x + 12',
      'Simplify RHS: 2x',
      'Move all variable terms to LHS: 4x  - 2x',
      'Move all constant terms to RHS:  - 12   ',
      'Add the liked terms on LHS: 1. 4x   - 2x  = 2x',
      'Add the liked terms on RHS: 2:  - 12  ',
      'Simplify and divide both sides by the factor: 2x =  - 12 ',
      'Solution: x = -6'
    ])
  })
})
