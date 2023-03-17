// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Calculate, CalculateData, CalculatePatch, CalculateQuery } from './calculate.schema'

export type { Calculate, CalculateData, CalculatePatch, CalculateQuery }

export interface CalculateServiceOptions {
  app: Application
}

export interface CalculateParams extends Params<CalculateQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class CalculateService<ServiceParams extends CalculateParams = CalculateParams>
  implements ServiceInterface<Calculate, CalculateData, ServiceParams, CalculatePatch>
{
  constructor(public options: CalculateServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Calculate[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Calculate> {
    return {
      equation: `A new message with ID: ${id}!`
    }
  }

  async create(data: CalculateData, params?: ServiceParams): Promise<Calculate>
  async create(data: CalculateData[], params?: ServiceParams): Promise<Calculate[]>
  async create(
    data: CalculateData | CalculateData[],
    params?: ServiceParams
  ): Promise<Calculate | Calculate[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: CalculateData, _params?: ServiceParams): Promise<Calculate> {
    return {
      // equation: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: CalculatePatch, _params?: ServiceParams): Promise<Calculate> {
    return {
      // id: 0,
      equation: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Calculate> {
    return {
      // id: 0,
      equation: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
