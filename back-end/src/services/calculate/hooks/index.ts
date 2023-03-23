import type { HookContext } from '../../../declarations'
import { divide, add, multiply, parse, simplify } from 'mathjs'

const getVariableCoefficient = (side: string) => {
  // Helper function to get the coefficient of the variable term in a side of the equation
  const variableMatch = side.match(/[+-]?[\d]*x/g)
  const variable = variableMatch ? variableMatch[0] : 'x'
  const coeffMatch = variable.match(/[+-]?[\d]*/g)
  const coeff = coeffMatch ? coeffMatch[0] : '1'
  return { coeff: Number(coeff), variable }
}

const transformEquation = (
  lhs: string,
  rhs: string,
  helpers: {
    checkIfLHSHasBrackets: boolean
    distributedSteps: string[]
    simplifiedSteps: string[]
    rhsHasEmptyCoeff?: boolean
  }
) => {
  // Move all the variable terms to the left-hand side of the equation
  // and all the constant terms to the right-hand side of the equation

  const { coeff: leftSideCoeff, variable: leftSideVariable } = getVariableCoefficient(lhs)
  const { coeff: rightSideCoeff, variable: rightSideVariable } = getVariableCoefficient(rhs)

  const { coeff, variable } = getVariableCoefficient(lhs)

  const { checkIfLHSHasBrackets, distributedSteps, rhsHasEmptyCoeff, simplifiedSteps } = helpers

  // @ts-ignore
  const constantOperatorLeft = parse(lhs).op
  // @ts-ignore
  const constantOperatorRight = !rhsHasEmptyCoeff && parse(rhs).op
  // @ts-ignore
  const constantOnLeftSide = parse(lhs).args[1].value
  // @ts-ignore
  const constantOnRightSide = !rhsHasEmptyCoeff ? parse(rhs).args[0].value : parse(rhs).value
  // @ts-ignore

  // @ts-ignore
  const coefOperatorSignRight = parse(rhs).op

  const addLeftSide = add(leftSideCoeff, multiply(-rightSideCoeff, coefOperatorSignRight === '-' ? -1 : 1))

  const constantWithSignLeft =
    constantOperatorLeft == '+' ? ' - ' + constantOnLeftSide : ' + ' + constantOnLeftSide

  // @ts-ignore
  const constantRightSideCheck = constantOnRightSide ? constantOnRightSide : parse(rhs).args[1].value

  const addRightSide = add(
    // @ts-ignore
    constantRightSideCheck,
    constantWithSignLeft.includes('-') ? -constantOnLeftSide : constantOnLeftSide
  )

  const constantWithSignRight =
    constantOperatorRight == '+' ? ' - ' + constantOnRightSide : ' + ' + constantOnRightSide

  // @ts-ignore
  const signsChangeConditions = ['+', '*']

  const coeffSignRight = signsChangeConditions.includes(coefOperatorSignRight)
    ? ' - ' + rightSideVariable
    : ' + ' + rightSideVariable

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
        `Move all variable terms to LHS: ${leftSideVariable} ${coeffSignRight}`,
        `Move all constant terms to RHS: ${constantRightSideCheck}   ${constantWithSignLeft}  `,
        `Add the liked terms on LHS: 1. ${leftSideVariable}   ${coeffSignRight}  = ${addLeftSide}x`,
        `Add the liked terms on RHS: 2: ${constantRightSideCheck}   ${constantWithSignLeft}  = ${addRightSide}`,
        `Simplify and divide both sides by the factor: ${addLeftSide}x = ${addRightSide}`,
        `Solution: x = ${divide(addRightSide, addLeftSide)}`
      ]

  const stepsDistributed = [...simplifiedSteps, ...distributedSteps, ...steps]
  return stepsDistributed
}

async function simplifyEquation(lhs: string, rhs: string, originalEquation: string) {
  // Simplify the equation

  const [simpLhs, simpRhs] = originalEquation.split('=').map((side) => side.trim())

  const simplifiedLhsNode = simplify(lhs)
  const simplifiedRhsNode = simplify(rhs)
  console.log('simplifiedRhsNode', simplifiedRhsNode)

  const simplifiedLhs = simplifiedLhsNode.toString()
  const simplifiedRhs = simplifiedRhsNode.toString()

  console.log('simplifiedRhs', parse(rhs).toString())

  const allSteps = [
    `Original equation: ${originalEquation}`,
    `Simplify LHS: ${simpLhs}`,
    `Simplify RHS: ${simpRhs}`
  ]

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

  const checkIfLHSHasBrackets = lhs.includes('(')

  const { updatedLHS, distributedSteps } = LHSNeedsDistrubition(lhs, checkIfLHSHasBrackets)

  // check if LHS containts parentesis for distrubution and multiplication

  // // Step 2: Simplify the equation
  const { allSteps } = await simplifyEquation(updatedLHS, rhs, equation)

  const { coeff: rightSideCoeff, variable: rightSideVariable } = getVariableCoefficient(rhs)

  const hasEmptyRightCoeff = rightSideCoeff == 0

  // // // Step 3: Move all the variable terms to one side and all the constant terms to the other side
  const transformed = transformEquation(updatedLHS, rhs, {
    checkIfLHSHasBrackets,
    distributedSteps,
    rhsHasEmptyCoeff: hasEmptyRightCoeff,
    simplifiedSteps: allSteps
  })
  return transformed
}

export const handleEquationStep = async (context: HookContext) => {
  const steps = await solveEquation(context.data.equation)
  context.result = {
    steps
  }
  return context
}
