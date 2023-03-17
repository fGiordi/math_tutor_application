// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import { atan2, chain, derivative, e, evaluate, log, pi, pow, round, sqrt, parse, simplify } from 'mathjs'

import {
  calculateDataValidator,
  calculatePatchValidator,
  calculateQueryValidator,
  calculateResolver,
  calculateExternalResolver,
  calculateDataResolver,
  calculatePatchResolver,
  calculateQueryResolver
} from './calculate.schema'

import type { Application, HookContext } from '../../declarations'
import { CalculateService, getOptions } from './calculate.class'
import { calculatePath, calculateMethods } from './calculate.shared'

export * from './calculate.class'
export * from './calculate.schema'

async function simplifyEquation(lhs: string, rhs: string) {
  // Simplify the equation using Math.js
  const lhsNode = parse(lhs)
  const rhsNode = parse(rhs)
  const simplifiedLhsNode = simplify(lhsNode)
  const simplifiedRhsNode = simplify(rhsNode)
  const simplifiedLhs = simplifiedLhsNode.toString()
  const simplifiedRhs = simplifiedRhsNode.toString()

  const allSteps = [
    `Original equation: ${lhs} = ${rhs}`,
    `Simplify LHS: ${simplifiedLhs}`,
    `Simplify RHS: ${simplifiedRhs}`
  ]

  return allSteps
}

async function solveEquation(equation: string) {
  // Step 1: Parse the input equation string
  const [lhs, rhs] = equation.split('=').map((side) => side.trim())

  console.log('lns', lhs)
  console.log('rhs', rhs)

  // // Step 2: Simplify the equation
  const simplified = await simplifyEquation(lhs, rhs)
  console.log('simplified', simplified)

  // // Step 3: Move all the variable terms to one side and all the constant terms to the other side
}

const testHook = (context: HookContext) => {
  console.log('after data', context.data)
  solveEquation(context.data.equation)
  return context
}

// A configure function that registers the service and its hooks via `app.configure`
export const calculate = (app: Application) => {
  // Register our service on the Feathers application
  app.use(calculatePath, new CalculateService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: calculateMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(calculatePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(calculateExternalResolver),
        schemaHooks.resolveResult(calculateResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(calculateQueryValidator),
        schemaHooks.resolveQuery(calculateQueryResolver)
      ],
      find: [],
      get: [],
      create: [testHook],
      patch: [
        schemaHooks.validateData(calculatePatchValidator),
        schemaHooks.resolveData(calculatePatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],

      create: [testHook]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [calculatePath]: CalculateService
  }
}
