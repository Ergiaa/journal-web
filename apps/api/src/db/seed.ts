import { papersRepository } from '../repositories/papers'
import { getMockPapers } from '../data/mock-data'

async function seed() {
  try {
    const mockPapers = getMockPapers()

    console.log(`Seeding ${mockPapers.length} papers...`)

    const papersToInsert = mockPapers.map(paper => ({
      title: paper.title,
      abstract: paper.abstract ?? null,
      authors: paper.authors,
      published_at: paper.publishedAt ? new Date(paper.publishedAt) : null,
      journal: paper.journal ?? null,
      doi: paper.doi ?? null,
      keywords: paper.keywords ?? null,
      source_url: paper.sourceUrl,
      source: paper.source ?? null,
      source_id: paper.sourceId ?? null,
      citation_count: paper.citationCount,
      embedding_stored: paper.embeddingStored,
    }))

    const inserted = await papersRepository.createMany(papersToInsert)

    console.log(`✓ Seeded ${inserted.length} papers successfully`)
    process.exit(0)
  } catch (error) {
    console.error('✗ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
