// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  calculatePatchValidator,
  calculateQueryValidator,
  calculateResolver,
  calculateExternalResolver,
  calculatePatchResolver,
  calculateQueryResolver
} from './calculate.schema'

import type { Application } from '../../declarations'
import { CalculateService, getOptions } from './calculate.class'
import { calculatePath, calculateMethods } from './calculate.shared'
import { handleEquationStep } from './hooks'

export * from './calculate.class'
export * from './calculate.schema'

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
      // run this hook on when we send request to this endpoint
      create: [handleEquationStep],
      patch: [
        schemaHooks.validateData(calculatePatchValidator),
        schemaHooks.resolveData(calculatePatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
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
