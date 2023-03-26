import type { HookContext } from '../../../declarations'
import {
  LHSNeedsDistrubition,
  getVariableCoefficient,
  breakDownEquation,
  transformEquation,
  sideLetter,
  sideLetterSplit
} from './helper'

export const ERROR_INVALID_MESSAGE = `Please ensure the format is correct: See examples "7x - 2 = 10x" or 2(4x + 3) + 6 = 2x + 2`

async function solveEquation(equation: string) {
  try {
    // Step 1: Parse the input equation string

    const [lhs, rhs] = equation.split('=').map((side) => side.trim())

    const { coeff: leftSideCoeff, variable: leftSideVariable } = getVariableCoefficient(lhs)
    const { coeff: rightSideCoeff, variable: rightSideVariable } = getVariableCoefficient(rhs)

    const lhsLetterSplit = sideLetterSplit(leftSideVariable)
    const rhsLetterSplit = sideLetterSplit(rightSideVariable)

    const lhsLetter = sideLetter(lhsLetterSplit)
    const rhsLetter = sideLetter(rhsLetterSplit)

    const bothExist = lhsLetter && rhsLetter

    if (bothExist && lhsLetter !== rhsLetter) {
      throw new Error('Variables are not the same. Please keep it consistent on both sides')
    }

    // check if distribution is required
    const checkIfLHSHasBrackets = lhs.includes('(')

    // Step 2: handle distribution if need be
    const { updatedLHS, distributedSteps } = LHSNeedsDistrubition(lhs, checkIfLHSHasBrackets, lhsLetter)
    const updatedVariableCoeff = updatedLHS.split(lhsLetter)[0]
    console.log('updatedLHS', updatedLHS)
    console.log('updatedVariableCoeff', updatedVariableCoeff)

    // check if LHS containts parentesis for distrubution and multiplication

    // // Step 2: Simplify the equation
    const { allSteps: preSteps } = await breakDownEquation(updatedLHS, rhs, equation)

    const hasEmptyRightCoeff = rightSideCoeff == 0

    // // // Step 3: Move all the variable terms to one side and all the constant terms to the other side
    const transformed = transformEquation(updatedLHS, rhs, {
      distributedSteps,
      rhsHasEmptyCoeff: hasEmptyRightCoeff,
      simplifiedSteps: preSteps,
      rightSideCoeff,
      rightSideVariable,
      leftSideCoeff,
      leftSideVariable,
      checkIfLHSHasBrackets,
      updatedVariableCoeffNumber: Number(updatedVariableCoeff),
      updatedVariableCoeff: `${updatedVariableCoeff}${lhsLetter}`
    })

    return transformed
  } catch (error: unknown) {
    console.log('error on solve equation', error)
    // @ts-ignore
    throw new Error(ERROR_INVALID_MESSAGE)
  }
}

export const handleEquationStep = async (context: HookContext) => {
  const result = await solveEquation(context.data.equation)
  context.result = {
    result
  }
  return context
}
