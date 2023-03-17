// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Calculate,
  CalculateData,
  CalculatePatch,
  CalculateQuery,
  CalculateService
} from './calculate.class'

export type { Calculate, CalculateData, CalculatePatch, CalculateQuery }

export type CalculateClientService = Pick<
  CalculateService<Params<CalculateQuery>>,
  (typeof calculateMethods)[number]
>

export const calculatePath = 'calculate'

export const calculateMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const calculateClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(calculatePath, connection.service(calculatePath), {
    methods: calculateMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [calculatePath]: CalculateClientService
  }
}
