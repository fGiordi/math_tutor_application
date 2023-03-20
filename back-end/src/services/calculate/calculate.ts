// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  atan2,
  chain,
  divide,
  derivative,
  add,
  multiply,
  e,
  evaluate,
  log,
  pi,
  pow,
  round,
  sqrt,
  parse,
  simplify
} from 'mathjs'

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

function getVariableCoefficient(side: any) {
  // Helper function to get the coefficient of the variable term in a side of the equation
  const variableMatch = side.match(/[+-]?[\d]*x/g)
  const variable = variableMatch ? variableMatch[0] : 'x'
  const coeffMatch = variable.match(/[+-]?[\d]*/g)
  const coeff = coeffMatch ? coeffMatch[0] : '1'
  return { coeff: Number(coeff), variable }
}

function transformSide(side: any, constantOnLeftSide: number, operator?: any) {
  // Helper function to transform a side of the equation
  const calcAdded = add(side, operator == '+' ? -constantOnLeftSide : constantOnLeftSide)
  return { calcAdded }
}

function transformEquation(simplified: any, lhs: any, rhs: any) {
  // Move all the variable terms to the left-hand side of the equation
  // and all the constant terms to the right-hand side of the equation

  const { coeff, variable } = getVariableCoefficient(lhs)
  // @ts-ignore
  const constantOperator = parse(lhs).op
  // @ts-ignore
  const constantOnLeftSide = parse(lhs).args[1].value
  const { calcAdded } = transformSide(rhs, constantOnLeftSide, constantOperator)
  const constantWithSign = constantOperator == '+' ? ' - ' + constantOnLeftSide : ' + ' + constantOnLeftSide

  // Display the steps to solve the equation

  const steps = [
    `Move all variable terms to LHS: ${variable}`,
    `Move all constant terms to RHS: ${rhs} ${constantWithSign}`,
    `Add ${constantOnLeftSide} to both sides: ${lhs} ${constantWithSign} = ${rhs} ${constantWithSign} `,
    `Simplify and divide both sides by the factor: ${variable} = ${calcAdded}`,
    `Solution: x = ${divide(calcAdded, coeff)}`
  ]
  return steps
}

async function simplifyEquation(lhs: string, rhs: string) {
  // Simplify the equation
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

  return { allSteps, lhs, rhs }
}

async function solveEquation(equation: string) {
  // Step 1: Parse the input equation string
  const [lhs, rhs] = equation.split('=').map((side) => side.trim())

  // // Step 2: Simplify the equation
  const { allSteps } = await simplifyEquation(lhs, rhs)
  // console.log('simplified', simplified)

  // // Step 3: Move all the variable terms to one side and all the constant terms to the other side
  const transformed = transformEquation(allSteps, lhs, rhs)
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
