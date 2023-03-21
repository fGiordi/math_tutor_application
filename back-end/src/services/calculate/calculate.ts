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

function transformSide(side: number, constantOnLeftSide: number, operator?: string) {
  // Helper function to transform a side of the equation
  const calcAdded = add(side, operator == '+' ? -constantOnLeftSide : constantOnLeftSide)
  return { calcAdded }
}

function transformEquation(
  lhs: string,
  rhs: string,
  helpers: {
    checkIfLHSHasBrackets: boolean
    distributedSteps: string[]
    rhsHasEmptyCoeff?: boolean
  }
) {
  // Move all the variable terms to the left-hand side of the equation
  // and all the constant terms to the right-hand side of the equation

  const { coeff: leftSideCoeff, variable: leftSideVariable } = getVariableCoefficient(lhs)
  const { coeff: rightSideCoeff, variable: rightSideVariable } = getVariableCoefficient(rhs)

  const { coeff, variable } = getVariableCoefficient(lhs)

  const { checkIfLHSHasBrackets, distributedSteps, rhsHasEmptyCoeff } = helpers

  // @ts-ignore
  const constantOperatorLeft = parse(lhs).op
  // @ts-ignore
  const constantOperatorRight = !rhsHasEmptyCoeff && parse(rhs).op
  // @ts-ignore
  const constantOnLeftSide = parse(lhs).args[1].value
  // @ts-ignore
  const constantOnRightSide = !rhsHasEmptyCoeff ? parse(rhs).args[0].value : parse(rhs).value
  // @ts-ignore

  const addLeftSide = add(leftSideCoeff, -rightSideCoeff)
  console.log('constantOnLeftSide', constantOnLeftSide)
  console.log('constantOnRightSide', constantOnRightSide)

  const constantWithSignLeft =
    constantOperatorLeft == '+' ? ' - ' + constantOnLeftSide : ' + ' + constantOnLeftSide

  console.log('constantWithSignLeft', constantWithSignLeft)

  const addRightSide = add(
    constantOnRightSide,
    constantWithSignLeft.includes('-') ? -constantOnLeftSide : constantOnLeftSide
  )
  console.log('addRightSide', addRightSide)

  const constantWithSignRight =
    constantOperatorRight == '+' ? ' - ' + constantOnRightSide : ' + ' + constantOnRightSide

  // Display the steps to solve the equation

  const steps = rhsHasEmptyCoeff
    ? [
        `Move all variable terms to LHS: ${leftSideVariable}`,
        `Move all constant terms to RHS: ${rhs} ${constantWithSignLeft}`,
        `Add ${constantOnLeftSide} to both sides: ${lhs} ${constantWithSignLeft} = ${rhs} ${constantWithSignLeft} `,
        `Simplify and divide both sides by the factor: ${leftSideVariable} = ${addRightSide}`,
        `Solution: x = ${divide(addRightSide, leftSideCoeff)}`
      ]
    : [
        `Move all variable terms to LHS: ${leftSideVariable} - ( ${rightSideVariable} )  `,
        `Move all constant terms to RHS: ${constantOnRightSide} - ( ${constantOnLeftSide} ) `,
        `Add the liked terms on LHS: 1. ${leftSideVariable} - ( ${rightSideVariable} ) = ${addLeftSide}x`,
        `Add the liked terms on RHS: 2: ${constantOnRightSide} - ( ${constantOnLeftSide} ) = ${addRightSide}`,
        `Simplify and divide both sides by the factor: ${addLeftSide}x = ${addRightSide}`,
        `Solution: x = ${divide(addRightSide, addLeftSide)}`
      ]

  const stepsDistributed = [...distributedSteps, ...steps]
  console.log('steps inside transform', steps)
  console.log('stepsDistributed', stepsDistributed)
  // return steps
}

async function simplifyEquation(lhs: string, rhs: string) {
  // Simplify the equation
  const lhsNode = parse(lhs)
  const rhsNode = parse(rhs)
  const simplifiedLhsNode = simplify(lhs)
  const simplifiedRhsNode = simplify(rhs)

  const simplifiedLhs = simplifiedLhsNode.toString()
  const simplifiedRhs = simplifiedRhsNode.toString()

  const allSteps = [`Original equation: ${lhs} = ${rhs}`, `Simplify LHS: ${lhs}`, `Simplify RHS: ${rhs}`]
  // console.log('allSteps in siplify', allSteps)

  return { allSteps }
}

const LHSNeedsDistrubition = (lhs: string, checkIfLHSHasBrackets: boolean) => {
  if (!checkIfLHSHasBrackets)
    return {
      updatedLHS: lhs,
      distributedSteps: []
    }

  const seperateExpr = lhs.split(')')
  const firstPart = seperateExpr[0]
  const secondPart = seperateExpr[1]
  const getNumberFromFirstPart = Number(firstPart.split('(')[0])
  const getExpressionInBrackets = firstPart.split('(')[1]

  const getExpressionInBracketsParse = parse(getExpressionInBrackets)

  // @ts-ignore
  const getExpressionOperator = parse(getExpressionInBrackets).op

  const operatorIsAddition = getExpressionOperator === '+'
  const operatorIsSubtraction = getExpressionOperator === '-'

  const operatorBeforeSign = operatorIsAddition ? ' + ' : operatorIsSubtraction ? ' - ' : ' '

  const { coeff: coeffInBracket, variable } = getVariableCoefficient(getExpressionInBrackets)
  // @ts-ignore
  const constantNumberInBracket = parse(getExpressionInBrackets).args[1].value

  const calcCoef = multiply(getNumberFromFirstPart, coeffInBracket)

  const calcConstant = multiply(
    getNumberFromFirstPart,
    operatorIsAddition
      ? +constantNumberInBracket
      : operatorIsSubtraction
      ? -constantNumberInBracket
      : constantNumberInBracket
  )
  console.log('calcConstant', calcConstant)
  // @ts-ignore
  const constantAdded = add(Number(calcConstant), Number(simplify(secondPart).value))
  console.log('constantAdded', constantAdded)

  const distrubtedExpression = `${calcCoef}x ${
    operatorIsSubtraction ? '' : operatorIsAddition === true && '+'
  }${calcConstant} ${secondPart}`

  const newLHS = `${calcCoef}x ${
    operatorIsSubtraction ? '' : operatorIsAddition === true && '+'
  } ${constantAdded}`
  console.log('newLHS', newLHS)

  const distributedSteps = [
    `Distribute LHS: ${simplify(lhs).toString()}`,
    `Add Numbers on LHS: ${distrubtedExpression}`,
    `Simplify liked terms on LHS: ${newLHS}`
  ]
  return { updatedLHS: newLHS, distributedSteps }
}

async function solveEquation(equation: string) {
  // Step 1: Parse the input equation string
  const [lhs, rhs] = equation.split('=').map((side) => side.trim())

  console.log('lhs simplified', simplify(lhs).toString())
  const checkIfLHSHasBrackets = lhs.includes('(')

  const { updatedLHS, distributedSteps } = LHSNeedsDistrubition(lhs, checkIfLHSHasBrackets)

  console.log('checkIfLHSHasBrackets', updatedLHS)

  // check if LHS containts parentesis for distrubution and multiplication

  // // Step 2: Simplify the equation
  const { allSteps } = await simplifyEquation(updatedLHS, rhs)

  const { coeff: rightSideCoeff, variable: rightSideVariable } = getVariableCoefficient(rhs)

  const hasEmptyRightCoeff = rightSideCoeff == 0

  // // // Step 3: Move all the variable terms to one side and all the constant terms to the other side
  const transformed = transformEquation(updatedLHS, rhs, {
    checkIfLHSHasBrackets,
    distributedSteps,
    rhsHasEmptyCoeff: hasEmptyRightCoeff
  })
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
