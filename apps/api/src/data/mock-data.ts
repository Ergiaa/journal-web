import type { Paper, SearchResult, SearchParams, Facets, FacetItem } from '../types'

const mockPapers: Paper[] = [
  // AI / Machine Learning
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing: A Comprehensive Survey',
    abstract: 'This paper presents a comprehensive survey of deep learning approaches applied to natural language processing tasks. We review recent advances in neural network architectures, attention mechanisms, and transformer models that have revolutionized the field.',
    authors: ['John Smith', 'Emily Chen', 'Michael Johnson'],
    publishedAt: '2024-03-15',
    journal: 'Journal of Artificial Intelligence Research',
    doi: '10.1234/jair.2024.001',
    keywords: ['deep learning', 'NLP', 'transformers', 'neural networks'],
    sourceUrl: 'https://arxiv.org/abs/2403.12345',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Transformer Architectures for Multi-Modal Learning: Vision and Language Integration',
    abstract: 'We propose a novel transformer architecture that seamlessly integrates visual and linguistic information. Our model achieves state-of-the-art performance on visual question answering and image captioning benchmarks.',
    authors: ['Sarah Williams', 'David Lee', 'Anna Martinez'],
    publishedAt: '2024-05-20',
    journal: 'Journal of Artificial Intelligence Research',
    doi: '10.1234/jair.2024.045',
    keywords: ['transformers', 'multi-modal', 'computer vision', 'NLP'],
    sourceUrl: 'https://arxiv.org/abs/2405.12345',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    title: 'Reinforcement Learning for Autonomous Decision Making in Complex Environments',
    abstract: 'This study explores reinforcement learning algorithms for autonomous decision-making in complex, dynamic environments. We demonstrate significant improvements in sample efficiency and policy robustness.',
    authors: ['Kevin Zhang', 'Amanda White', 'Christopher Davis'],
    publishedAt: '2024-01-10',
    journal: 'Machine Learning Journal',
    doi: '10.5678/mlj.2024.012',
    keywords: ['reinforcement learning', 'autonomous systems', 'decision making'],
    sourceUrl: 'https://arxiv.org/abs/2401.12345',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    title: 'Federated Learning: Privacy-Preserving Machine Learning at Scale',
    abstract: 'Federated learning enables model training across decentralized data sources without centralizing sensitive information. This paper addresses key challenges in communication efficiency and differential privacy.',
    authors: ['Lisa Thompson', 'Mark Anderson', 'Jennifer Taylor'],
    publishedAt: '2023-11-05',
    journal: 'Machine Learning Journal',
    doi: '10.5678/mlj.2023.089',
    keywords: ['federated learning', 'privacy', 'distributed systems', 'machine learning'],
    sourceUrl: 'https://arxiv.org/abs/2311.12345',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    title: 'Explainable AI: Interpreting Deep Neural Network Decisions',
    abstract: 'As AI systems are deployed in high-stakes domains, explainability becomes crucial. We present novel methods for interpreting deep neural network decisions with human-understandable explanations.',
    authors: ['Robert Brown', 'Maria Garcia', 'James Wilson'],
    publishedAt: '2023-08-22',
    journal: 'Nature Machine Intelligence',
    doi: '10.1038/s42256-023-00123-4',
    keywords: ['explainable AI', 'interpretability', 'neural networks', 'transparency'],
    sourceUrl: 'https://www.nature.com/articles/s42256-023-00123-4',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  // Quantum Computing
  {
    id: '7',
    title: 'Quantum Computing: Principles, Progress, and Prospects',
    abstract: 'Quantum computing represents a paradigm shift in computational capabilities. This review examines fundamental principles, surveys current hardware progress, and discusses prospective applications.',
    authors: ['Sarah Williams', 'David Lee', 'Robert Brown', 'Anna Martinez'],
    publishedAt: '2024-02-20',
    journal: 'Nature Quantum Information',
    doi: '10.5678/nqi.2024.042',
    keywords: ['quantum computing', 'qubits', 'quantum algorithms', 'cryptography'],
    sourceUrl: 'https://www.nature.com/articles/s41567-024-01234-5',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '8',
    title: 'Quantum Error Correction: Towards Fault-Tolerant Quantum Computation',
    abstract: 'Quantum error correction is essential for building reliable quantum computers. We review recent advances in error-correcting codes and fault-tolerant architectures.',
    authors: ['Thomas Moore', 'Rachel Green', 'Paul Robinson'],
    publishedAt: '2024-04-08',
    journal: 'Nature Quantum Information',
    doi: '10.5678/nqi.2024.078',
    keywords: ['quantum computing', 'error correction', 'fault tolerance', 'qubits'],
    sourceUrl: 'https://www.nature.com/articles/s41567-024-07890-1',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  // Climate & Environment
  {
    id: '10',
    title: 'Climate Change Impact on Global Biodiversity: A Meta-Analysis',
    abstract: 'We conducted a meta-analysis of 500+ studies examining climate change impacts on global biodiversity. Results indicate significant shifts in species distribution patterns.',
    authors: ['Maria Garcia', 'James Wilson'],
    publishedAt: '2024-01-10',
    journal: 'Global Change Biology',
    doi: '10.9012/gcb.2024.089',
    keywords: ['climate change', 'biodiversity', 'ecosystems', 'meta-analysis'],
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/38123456/',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '12',
    title: 'Carbon Sequestration in Forest Ecosystems: A Global Assessment',
    abstract: 'Forests play a critical role in carbon sequestration. We present a global assessment of carbon storage in different forest types and discuss management strategies.',
    authors: ['Patrick Turner', 'Olivia Scott', 'Rebecca Hall'],
    publishedAt: '2024-03-28',
    journal: 'Environmental Science & Technology',
    doi: '10.1021/est.2024.01234',
    keywords: ['climate change', 'carbon sequestration', 'forests', 'sustainability'],
    sourceUrl: 'https://pubs.acs.org/doi/10.1021/est.2024.01234',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  // Medicine & Biotechnology
  {
    id: '15',
    title: 'CRISPR-Cas9 Gene Editing: Ethical Considerations and Clinical Applications',
    abstract: 'CRISPR-Cas9 technology has opened new frontiers in genetic medicine. This paper explores ethical considerations and discusses current clinical trials for somatic cell therapies.',
    authors: ['Jennifer Taylor', 'Mark Anderson', 'Lisa Thompson'],
    publishedAt: '2023-12-05',
    journal: 'Nature Medicine',
    doi: '10.3456/nm.2023.156',
    keywords: ['CRISPR', 'gene editing', 'bioethics', 'clinical trials'],
    sourceUrl: 'https://www.nature.com/articles/nm.2023.156',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '19',
    title: 'Microbiome-Gut-Brain Axis: Implications for Mental Health',
    abstract: 'Emerging research reveals the critical role of the gut microbiome in mental health. This review synthesizes findings from microbiology, neuroscience, and psychiatry.',
    authors: ['Rebecca Hall', 'Patrick Turner', 'Olivia Scott'],
    publishedAt: '2023-12-20',
    journal: 'Nature Reviews Neuroscience',
    doi: '10.1234/nrn.2023.099',
    keywords: ['microbiome', 'gut-brain axis', 'mental health', 'neuroscience'],
    sourceUrl: 'https://www.nature.com/articles/nrn.2023.099',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  // Psychology & Social Sciences
  {
    id: '21',
    title: 'The Psychology of Social Media: Understanding Digital Behavior',
    abstract: 'This study examines psychological factors influencing social media behavior. Through surveys of 10,000 participants across 15 countries, we identify patterns in digital addiction and social comparison.',
    authors: ['Laura Martinez', 'Steven Clark', 'Jessica Lewis'],
    publishedAt: '2024-02-14',
    journal: 'Journal of Social Psychology',
    doi: '10.4567/jsp.2024.078',
    keywords: ['social media', 'psychology', 'digital behavior', 'mental health'],
    sourceUrl: 'https://psycnet.apa.org/record/2024-02140-001',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  // Technology & Engineering
  {
    id: '24',
    title: 'Autonomous Vehicles: Technical Challenges and Regulatory Frameworks',
    abstract: 'The development of autonomous vehicles presents both technical and regulatory challenges. This paper reviews sensor fusion technologies, decision-making algorithms, and safety protocols.',
    authors: ['Andrew Kim', 'Samantha Wright', 'Brian Adams'],
    publishedAt: '2024-01-25',
    journal: 'IEEE Transactions on Intelligent Transportation Systems',
    doi: '10.8901/tits.2024.045',
    keywords: ['autonomous vehicles', 'self-driving', 'regulation', 'AI safety'],
    sourceUrl: 'https://ieeexplore.ieee.org/document/2024.045',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
  {
    id: '26',
    title: 'Blockchain Technology in Supply Chain Management: Opportunities and Challenges',
    abstract: 'This study investigates blockchain applications in supply chain management, analyzing case studies from major industries and discussing implementation challenges.',
    authors: ['Thomas Moore', 'Rachel Green'],
    publishedAt: '2023-11-18',
    journal: 'International Journal of Logistics',
    doi: '10.7890/ijl.2023.201',
    keywords: ['blockchain', 'supply chain', 'transparency', 'logistics'],
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S20231118',
    citationCount: 0,
    embeddingStored: false,
    createdAt: '2024-01-01',
  },
]

function computeFacets(papers: Paper[]): Facets {
  const journalCounts = new Map<string, number>()
  const authorCounts = new Map<string, number>()
  const yearCounts = new Map<string, number>()
  const keywordCounts = new Map<string, number>()

  for (const p of papers) {
    if (p.journal) {
      journalCounts.set(p.journal, (journalCounts.get(p.journal) ?? 0) + 1)
    }
    for (const author of p.authors) {
      authorCounts.set(author, (authorCounts.get(author) ?? 0) + 1)
    }
    const year = p.publishedAt.slice(0, 4)
    if (year) yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1)
    for (const kw of p.keywords ?? []) {
      keywordCounts.set(kw, (keywordCounts.get(kw) ?? 0) + 1)
    }
  }

  const toFacetItems = (map: Map<string, number>): FacetItem[] =>
    Array.from(map.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)

  return {
    journals: toFacetItems(journalCounts),
    authors: toFacetItems(authorCounts),
    years: toFacetItems(yearCounts),
    keywords: toFacetItems(keywordCounts),
  }
}

export function getMockPapers(): Paper[] {
  return mockPapers
}

export function searchMockPapers(params: SearchParams): SearchResult {
  const {
    q = '',
    page = 1,
    pageSize = 10,
    authorFilter,
    journalFilter,
    keywordFilter,
    yearFrom,
    yearTo,
    sortBy = 'relevance',
  } = params

  const lowerQuery = q.toLowerCase()

  // 1. Text search
  let baseFiltered = mockPapers.filter((p) => {
    if (!q) return true
    return (
      p.title.toLowerCase().includes(lowerQuery) ||
      p.abstract?.toLowerCase().includes(lowerQuery) ||
      p.authors.some((a) => a.toLowerCase().includes(lowerQuery)) ||
      p.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)) ||
      (p.journal ?? '').toLowerCase().includes(lowerQuery)
    )
  })

  // 2. Author and year filters (applied before facet sets)
  if (authorFilter) {
    const lowerAuthor = authorFilter.toLowerCase()
    baseFiltered = baseFiltered.filter((p) =>
      p.authors.some((a) => a.toLowerCase().includes(lowerAuthor))
    )
  }

  if (yearFrom !== undefined || yearTo !== undefined) {
    baseFiltered = baseFiltered.filter((p) => {
      const year = parseInt(p.publishedAt.slice(0, 4))
      if (yearFrom !== undefined && year < yearFrom) return false
      if (yearTo !== undefined && year > yearTo) return false
      return true
    })
  }

  // 3. Compute independent facet sets (for multi-select)
  // journals facet: excludes keyword filter so other journals remain visible
  const journalFacetSet = keywordFilter && keywordFilter.length > 0
    ? baseFiltered.filter((p) => p.keywords?.some((k) => keywordFilter.includes(k)))
    : baseFiltered

  // keywords facet: excludes journal filter so other keywords remain visible
  const keywordFacetSet = journalFilter && journalFilter.length > 0
    ? baseFiltered.filter((p) => journalFilter.includes(p.journal ?? ''))
    : baseFiltered

  // 4. Final result set: both filters applied
  let finalFiltered = journalFacetSet.filter((p) =>
    !journalFilter || journalFilter.length === 0 || journalFilter.includes(p.journal ?? '')
  )

  // 5. Compute facets — each set computed once
  const journalFacets = computeFacets(journalFacetSet)
  const keywordFacets = computeFacets(keywordFacetSet)
  const finalFacets = computeFacets(finalFiltered)

  const facets: Facets = {
    journals: journalFacets.journals,
    keywords: keywordFacets.keywords,
    authors: finalFacets.authors,
    years: finalFacets.years,
  }

  // 6. Sort
  if (sortBy !== 'relevance') {
    finalFiltered = [...finalFiltered].sort((a, b) => {
      switch (sortBy) {
        case 'date_desc': return b.publishedAt.localeCompare(a.publishedAt)
        case 'date_asc':  return a.publishedAt.localeCompare(b.publishedAt)
        case 'title_asc': return a.title.localeCompare(b.title)
        case 'author_asc': return (a.authors[0] ?? '').localeCompare(b.authors[0] ?? '')
        default: return 0
      }
    })
  }

  // 7. Paginate
  const start = (page - 1) * pageSize

  return {
    papers: finalFiltered.slice(start, start + pageSize),
    total: finalFiltered.length,
    page,
    pageSize,
    facets,
  }
}

export function getMockPaperById(id: string): Paper | undefined {
  return mockPapers.find((p) => p.id === id)
}

export function getMockRelatedPapers(id: string): Paper[] {
  const target = getMockPaperById(id)
  if (!target) return []

  return mockPapers.filter((p) => {
    if (p.id === id) return false
    const hasCommonKeyword = target.keywords?.some((k) => p.keywords?.includes(k))
    const hasCommonAuthor = target.authors.some((a) => p.authors.includes(a))
    return hasCommonKeyword || hasCommonAuthor
  })
}

export function getMockAvailableJournals(): string[] {
  return Array.from(new Set(mockPapers.map((p) => p.journal).filter(Boolean))).sort() as string[]
}
