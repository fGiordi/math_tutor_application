import { divide, add, multiply, parse, simplify, round, subtract } from 'mathjs'

interface TransformEquationHelpers {
  rightSideCoeff: number
  rightSideVariable: string
  leftSideCoeff: number
  leftSideVariable: string
  distributedSteps: string[]
  simplifiedSteps: string[]
  updatedVariableCoeff: string
  updatedVariableCoeffNumber: number
  checkIfLHSHasBrackets: boolean
  rhsHasEmptyCoeff?: boolean
}

interface SidesProps {
  lhs: string
  rhs: string
}

export const getVariableCoefficient = (side: string) => {
  // Helper function to get the coefficient of the variable term in a side of the equation
  const variableMatch = side.match(/[+-]?[\d]*[a-z]/g)
  const variable = variableMatch ? variableMatch[0] : 'x'
  const coeffMatch = variable.match(/[+-]?[\d]*/g)
  const coeff = coeffMatch ? coeffMatch[0] : '1'
  return { coeff: Number(coeff), variable }
}
export const sideLetterSplit = (side: string) => side.split('')

export const sideLetter = (sideSplit: string[]) => {
  return sideSplit[sideSplit.length - 1]
}

export const transformEquation = ({ lhs, rhs }: SidesProps, helpers: TransformEquationHelpers) => {
  // Move all the variable terms to the left-hand side of the equation
  // and all the constant terms to the right-hand side of the equation

  const {
    rightSideCoeff,
    rightSideVariable,
    leftSideCoeff,
    leftSideVariable,
    distributedSteps,
    rhsHasEmptyCoeff,
    simplifiedSteps,
    updatedVariableCoeff,
    updatedVariableCoeffNumber,
    checkIfLHSHasBrackets
  } = helpers

  const lhsLetterSplit = sideLetterSplit(leftSideVariable)

  const lhsLetter = sideLetter(lhsLetterSplit)

  // @ts-ignore
  const constantOperatorLeft = parse(lhs).op
  // @ts-ignore
  const constantOnLeftSide = parse(lhs).args[1].value
  // @ts-ignore
  const constantOnRightSide = !rhsHasEmptyCoeff ? parse(rhs).args[0].value : parse(rhs).value
  // @ts-ignore

  // @ts-ignore
  const coefOperatorSignRight = simplify(rhs).op

  const addLeftSide = add(leftSideCoeff, multiply(-rightSideCoeff, coefOperatorSignRight === '-' ? -1 : 1))

  const constantWithSignLeft =
    constantOperatorLeft == '+' ? ' - ' + constantOnLeftSide : ' + ' + constantOnLeftSide

  // @ts-ignore
  const constantRightSideCheck = constantOnRightSide ? constantOnRightSide : parse(rhs).args[1].value
  // @ts-ignore
  const rhsWithCoefOnlyName = parse(rhs).args ? parse(rhs).args[1].name : parse(rhs).value

  const rhsWithCoefOnly = rhsWithCoefOnlyName === 'x'

  const addRightSide = add(
    // @ts-ignore
    constantRightSideCheck,
    constantWithSignLeft.includes('-') ? -constantOnLeftSide : constantOnLeftSide
  )

  // @ts-ignore
  const signsChangeConditions = ['+', '*']

  const coeffSignRight = signsChangeConditions.includes(coefOperatorSignRight)
    ? ' - ' + rightSideVariable
    : ' + ' + rightSideVariable

  // Display the steps to solve the equation

  const rhsHasEmptyCoeffSolution = checkIfLHSHasBrackets
    ? round(Number(divide(addRightSide, updatedVariableCoeffNumber)), 3)
    : round(Number(divide(addRightSide, leftSideCoeff)), 3)

  const lhsCheckDistributedVariable = checkIfLHSHasBrackets ? updatedVariableCoeff : leftSideVariable
  const distrubtedAddLHS = coeffSignRight.includes('-')
    ? subtract(updatedVariableCoeffNumber, addLeftSide)
    : add(updatedVariableCoeffNumber, addLeftSide)

  const steps = rhsHasEmptyCoeff
    ? [
        `Move all variable terms to LHS: ${lhsCheckDistributedVariable}`,
        `Move all constant terms to RHS: ${rhs} ${constantWithSignLeft}`,
        `Add ${constantOnLeftSide} to both sides: ${lhs} ${constantWithSignLeft} = ${rhs} ${constantWithSignLeft} `,
        `Simplify and divide both sides by the factor: ${lhsCheckDistributedVariable} = ${addRightSide}`,
        `Solution: ${lhsLetter} = ${rhsHasEmptyCoeffSolution}`
      ]
    : [
        `Move all variable terms to LHS: ${lhsCheckDistributedVariable} ${coeffSignRight}`,
        `Move all constant terms to RHS: ${
          rhsWithCoefOnly ? `${constantWithSignLeft}` : `${constantRightSideCheck}  ${constantWithSignLeft}`
        }   `,
        `Add the liked terms on LHS: 1. ${lhsCheckDistributedVariable}  ${coeffSignRight}  = ${
          checkIfLHSHasBrackets ? distrubtedAddLHS : addLeftSide
        }${lhsLetter}`,
        `Add the liked terms on RHS: 2: ${
          rhsWithCoefOnly
            ? `${constantWithSignLeft}`
            : `${constantRightSideCheck} ${constantWithSignLeft}  = ${addRightSide}`
        }  `,
        `Simplify and divide both sides by the factor: ${
          rhsWithCoefOnly
            ? `${addLeftSide}${lhsLetter} = ${constantWithSignLeft}`
            : `${checkIfLHSHasBrackets ? distrubtedAddLHS : addLeftSide}${lhsLetter} = ${addRightSide}`
        } `,
        `Solution: ${lhsLetter} = ${
          rhsWithCoefOnly
            ? round(
                Number(
                  divide(
                    constantWithSignLeft.includes('-') ? -constantOnLeftSide : constantOnLeftSide,
                    addLeftSide
                  )
                ),
                3
              )
            : checkIfLHSHasBrackets
            ? round(Number(divide(addRightSide, distrubtedAddLHS)), 3)
            : round(Number(divide(addRightSide, addLeftSide)), 3)
        }`
      ]

  const stepsDistributed = [...simplifiedSteps, ...distributedSteps, ...steps]
  // strip solution from steps
  const solution = stepsDistributed[stepsDistributed.length - 1].split(': ')[1].trim()
  return { steps: stepsDistributed, solution }
}

export const breakDownEquation = (lhs: string, rhs: string, originalEquation: string) => {
  // Simplify the equation in pre steps

  const [simpLhs, simpRhs] = originalEquation.split('=').map((side) => side.trim())

  const allSteps = [
    `Original equation: ${originalEquation}`,
    `Simplify LHS: ${simpLhs}`,
    `Simplify RHS: ${simpRhs}`
  ]

  return { allSteps }
}

export const LHSNeedsDistrubition = (lhs: string, checkIfLHSHasBrackets: boolean, variableLetter: string) => {
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

  // @ts-ignore
  const getExpressionOperator = parse(getExpressionInBrackets).op

  const operatorIsAddition = getExpressionOperator === '+'
  const operatorIsSubtraction = getExpressionOperator === '-'

  const { coeff: coeffInBracket } = getVariableCoefficient(getExpressionInBrackets)
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
  // @ts-ignore
  const constantAdded = add(Number(calcConstant), Number(simplify(secondPart).value))

  const distrubtedExpression = `${calcCoef}${variableLetter} ${
    operatorIsSubtraction ? '' : operatorIsAddition === true && '+'
  }${calcConstant} ${secondPart}`

  const newLHS = `${calcCoef}${variableLetter} ${
    operatorIsSubtraction ? '' : operatorIsAddition === true && '+'
  } ${constantAdded}`

  const distributedSteps = [
    `Distribute LHS: ${simplify(lhs).toString()}`,
    `Add Numbers on LHS: ${distrubtedExpression}`,
    `Simplify liked terms on LHS: ${newLHS}`
  ]
  return { updatedLHS: newLHS, distributedSteps }
}
