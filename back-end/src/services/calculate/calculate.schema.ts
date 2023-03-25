// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const calculateSchema = Type.Object(
  {
    equation: Type.String(),
    result: Type.Object({
      steps: Type.Object({}),
      solution: Type.String()
    })
  },
  { $id: 'Calculate', additionalProperties: false }
)
export type Calculate = Static<typeof calculateSchema>
export const calculateValidator = getValidator(calculateSchema, dataValidator)
export const calculateResolver = resolve<Calculate, HookContext>({})

export const calculateExternalResolver = resolve<Calculate, HookContext>({})

// Schema for creating new entries
export const calculateDataSchema = Type.Pick(calculateSchema, ['equation'], {
  $id: 'CalculateData'
})
export type CalculateData = Static<typeof calculateDataSchema>
export const calculateDataValidator = getValidator(calculateDataSchema, dataValidator)
export const calculateDataResolver = resolve<Calculate, HookContext>({})

// Schema for updating existing entries
export const calculatePatchSchema = Type.Partial(calculateSchema, {
  $id: 'CalculatePatch'
})
export type CalculatePatch = Static<typeof calculatePatchSchema>
export const calculatePatchValidator = getValidator(calculatePatchSchema, dataValidator)
export const calculatePatchResolver = resolve<Calculate, HookContext>({})

// Schema for allowed query properties
export const calculateQueryProperties = Type.Pick(calculateSchema, ['equation'])
export const calculateQuerySchema = Type.Intersect(
  [
    querySyntax(calculateQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CalculateQuery = Static<typeof calculateQuerySchema>
export const calculateQueryValidator = getValidator(calculateQuerySchema, queryValidator)
export const calculateQueryResolver = resolve<CalculateQuery, HookContext>({})
