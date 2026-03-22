import type { Paper, SearchParams, SearchResult } from '../types'
import { papersRepository } from '../repositories/papers'

export const papersService = {
  async search(params: SearchParams): Promise<SearchResult> {
    return papersRepository.findMany(params)
  },

  async getById(id: string): Promise<Paper | null> {
    return papersRepository.findById(id)
  },

  async getRelated(id: string, limit: number = 5): Promise<Paper[]> {
    return papersRepository.findRelated(id, limit)
  },

  async getAvailableJournals(): Promise<string[]> {
    return papersRepository.getAvailableJournals()
  },
}
