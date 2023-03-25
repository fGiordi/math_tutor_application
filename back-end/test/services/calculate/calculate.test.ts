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
  //
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

  it('Solve 2(4x + 3) + 6 = 2x + 2 should return x = -1.667"', async () => {
    const expression = '2(4x + 3) + 6 = 2x + 2'
    const service = app.service('calculate')

    const {
      result: { solution, steps }
    } = await service.create({ equation: expression })

    assert.equal(solution, 'x = -1.667')
    assert.deepStrictEqual(steps, [
      'Original equation: 2(4x + 3) + 6 = 2x + 2',
      'Simplify LHS: 2(4x + 3) + 6',
      'Simplify RHS: 2x + 2',
      'Distribute LHS: 2 (4 x + 3) + 6',
      'Add Numbers on LHS: 8x +6  + 6',
      'Simplify liked terms on LHS: 8x + 12',
      'Move all variable terms to LHS: 8x  - 2x',
      'Move all constant terms to RHS: 2   - 12   ',
      'Add the liked terms on LHS: 1. 8x   - 2x  = 6x',
      'Add the liked terms on RHS: 2: 2  - 12  = -10  ',
      'Simplify and divide both sides by the factor: 6x = -10 ',
      'Solution: x = -1.667'
    ])
  })

  it('Solve 3(4x + 3) + 6 = 39 should return x = 2"', async () => {
    const expression = '3(4x + 3) + 6 = 39'
    const service = app.service('calculate')

    const {
      result: { solution, steps }
    } = await service.create({ equation: expression })

    assert.equal(solution, 'x = 2')
    assert.deepStrictEqual(steps, [
      'Original equation: 3(4x + 3) + 6 = 39',
      'Simplify LHS: 3(4x + 3) + 6',
      'Simplify RHS: 39',
      'Distribute LHS: 3 (4 x + 3) + 6',
      'Add Numbers on LHS: 12x +9  + 6',
      'Simplify liked terms on LHS: 12x + 15',
      'Move all variable terms to LHS: 12x',
      'Move all constant terms to RHS: 39  - 15',
      'Add 15 to both sides: 12x + 15  - 15 = 39  - 15 ',
      'Simplify and divide both sides by the factor: 12x = 24',
      'Solution: x = 2'
    ])
  })
})
