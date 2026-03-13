import type { Journal, SearchResult } from '@/types/journal'

const mockJournals: Journal[] = [
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing: A Comprehensive Survey',
    abstract: 'This paper presents a comprehensive survey of deep learning approaches applied to natural language processing tasks. We review recent advances in neural network architectures, attention mechanisms, and transformer models that have revolutionized the field. The survey covers applications in machine translation, sentiment analysis, named entity recognition, and question answering systems.',
    authors: ['John Smith', 'Emily Chen', 'Michael Johnson'],
    publishedDate: '2024-03-15',
    journal: 'Journal of Artificial Intelligence Research',
    doi: '10.1234/jair.2024.001',
    keywords: ['deep learning', 'NLP', 'transformers', 'neural networks'],
    sourceUrl: 'https://arxiv.org/abs/2403.12345',
  },
  {
    id: '2',
    title: 'Quantum Computing: Principles, Progress, and Prospects',
    abstract: 'Quantum computing represents a paradigm shift in computational capabilities. This review examines the fundamental principles of quantum mechanics that enable quantum computation, surveys current progress in quantum hardware development, and discusses prospective applications in cryptography, optimization, and simulation.',
    authors: ['Sarah Williams', 'David Lee', 'Robert Brown', 'Anna Martinez'],
    publishedDate: '2024-02-20',
    journal: 'Nature Quantum Information',
    doi: '10.5678/nqi.2024.042',
    keywords: ['quantum computing', 'qubits', 'quantum algorithms', 'cryptography'],
    sourceUrl: 'https://www.nature.com/articles/s41567-024-01234-5',
  },
  {
    id: '3',
    title: 'Climate Change Impact on Global Biodiversity: A Meta-Analysis',
    abstract: 'We conducted a meta-analysis of 500+ studies examining the impact of climate change on global biodiversity. Results indicate significant shifts in species distribution patterns, with an average poleward movement of 17 km per decade. The analysis reveals critical thresholds beyond which ecosystem collapse becomes probable.',
    authors: ['Maria Garcia', 'James Wilson'],
    publishedDate: '2024-01-10',
    journal: 'Global Change Biology',
    doi: '10.9012/gcb.2024.089',
    keywords: ['climate change', 'biodiversity', 'ecosystems', 'meta-analysis'],
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/38123456/',
  },
  {
    id: '4',
    title: 'CRISPR-Cas9 Gene Editing: Ethical Considerations and Clinical Applications',
    abstract: 'The advent of CRISPR-Cas9 technology has opened new frontiers in genetic medicine. This paper explores the ethical considerations surrounding germline editing, discusses current clinical trials for somatic cell therapies, and proposes a framework for responsible innovation in gene editing technologies.',
    authors: ['Jennifer Taylor', 'Mark Anderson', 'Lisa Thompson'],
    publishedDate: '2023-12-05',
    journal: 'Nature Medicine',
    doi: '10.3456/nm.2023.156',
    keywords: ['CRISPR', 'gene editing', 'bioethics', 'clinical trials'],
    sourceUrl: 'https://www.nature.com/articles/nm.2023.156',
  },
  {
    id: '5',
    title: 'Blockchain Technology in Supply Chain Management: Opportunities and Challenges',
    abstract: 'This study investigates the application of blockchain technology in supply chain management. We analyze case studies from major industries, identify key opportunities for transparency and traceability, and discuss implementation challenges including scalability and regulatory compliance.',
    authors: ['Thomas Moore', 'Rachel Green'],
    publishedDate: '2023-11-18',
    journal: 'International Journal of Logistics',
    doi: '10.7890/ijl.2023.201',
    keywords: ['blockchain', 'supply chain', 'transparency', 'logistics'],
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S20231118',
  },
  {
    id: '6',
    title: 'Machine Learning for Drug Discovery: Recent Advances and Future Directions',
    abstract: 'Machine learning has emerged as a powerful tool in pharmaceutical research. This review covers recent advances in deep learning for molecular property prediction, generative models for de novo drug design, and reinforcement learning approaches for optimizing drug candidates.',
    authors: ['Kevin Zhang', 'Amanda White', 'Christopher Davis', 'Nicole Brown', 'Daniel Miller'],
    publishedDate: '2024-04-01',
    journal: 'Drug Discovery Today',
    doi: '10.2345/ddt.2024.301',
    keywords: ['machine learning', 'drug discovery', 'pharmaceuticals', 'AI'],
    sourceUrl: 'https://www.cell.com/drug-discovery-today/fulltext/S2024.04.001',
  },
  {
    id: '7',
    title: 'Renewable Energy Storage Technologies: A Comparative Analysis',
    abstract: 'As renewable energy adoption accelerates, efficient storage solutions become critical. This comparative analysis examines battery technologies, pumped hydro storage, compressed air energy storage, and emerging hydrogen-based systems, evaluating their economic viability and environmental impact.',
    authors: ['Paul Robinson', 'Emma Harris'],
    publishedDate: '2024-03-28',
    journal: 'Energy Storage Materials',
    doi: '10.6789/esm.2024.102',
    keywords: ['renewable energy', 'energy storage', 'batteries', 'sustainability'],
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S20240328',
  },
  {
    id: '8',
    title: 'The Psychology of Social Media: Understanding Digital Behavior',
    abstract: 'This comprehensive study examines the psychological factors influencing social media behavior. Through surveys of 10,000 participants across 15 countries, we identify patterns in digital addiction, social comparison, and online identity formation, with implications for mental health interventions.',
    authors: ['Laura Martinez', 'Steven Clark', 'Jessica Lewis'],
    publishedDate: '2024-02-14',
    journal: 'Journal of Social Psychology',
    doi: '10.4567/jsp.2024.078',
    keywords: ['social media', 'psychology', 'digital behavior', 'mental health'],
    sourceUrl: 'https://psycnet.apa.org/record/2024-02140-001',
  },
  {
    id: '9',
    title: 'Autonomous Vehicles: Technical Challenges and Regulatory Frameworks',
    abstract: 'The development of autonomous vehicles presents both technical and regulatory challenges. This paper reviews sensor fusion technologies, decision-making algorithms, and safety protocols, while analyzing emerging regulatory frameworks across different jurisdictions.',
    authors: ['Andrew Kim', 'Samantha Wright', 'Brian Adams'],
    publishedDate: '2024-01-25',
    journal: 'IEEE Transactions on Intelligent Transportation Systems',
    doi: '10.8901/tits.2024.045',
    keywords: ['autonomous vehicles', 'self-driving', 'regulation', 'AI safety'],
    sourceUrl: 'https://ieeexplore.ieee.org/document/2024.045',
  },
  {
    id: '10',
    title: 'Microbiome-Gut-Brain Axis: Implications for Mental Health',
    abstract: 'Emerging research reveals the critical role of the gut microbiome in mental health. This review synthesizes findings from microbiology, neuroscience, and psychiatry to elucidate mechanisms of the gut-brain axis and potential therapeutic applications for depression and anxiety.',
    authors: ['Rebecca Hall', 'Patrick Turner', 'Olivia Scott'],
    publishedDate: '2023-12-20',
    journal: 'Nature Reviews Neuroscience',
    doi: '10.1234/nrn.2023.099',
    keywords: ['microbiome', 'gut-brain axis', 'mental health', 'neuroscience'],
    sourceUrl: 'https://www.nature.com/articles/nrn.2023.099',
  },
]

export function getMockJournals(): Journal[] {
  return mockJournals
}

export function searchMockJournals(query: string, page: number, pageSize: number): SearchResult {
  const lowerQuery = query.toLowerCase()
  
  const filtered = mockJournals.filter((journal) => {
    return (
      journal.title.toLowerCase().includes(lowerQuery) ||
      journal.abstract?.toLowerCase().includes(lowerQuery) ||
      journal.authors.some((author) => author.toLowerCase().includes(lowerQuery)) ||
      journal.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery)) ||
      journal.journal.toLowerCase().includes(lowerQuery)
    )
  })

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedJournals = filtered.slice(start, end)

  return {
    journals: paginatedJournals,
    total: filtered.length,
    page,
    pageSize,
  }
}

export function getMockJournalById(id: string): Journal | undefined {
  return mockJournals.find((journal) => journal.id === id)
}

export function getMockRelatedJournals(id: string): Journal[] {
  const journal = getMockJournalById(id)
  if (!journal) return []

  return mockJournals
    .filter((j) => {
      if (j.id === id) return false
      const hasCommonKeywords = journal.keywords?.some((k) => j.keywords?.includes(k))
      const hasCommonAuthor = journal.authors.some((a) => j.authors.includes(a))
      return hasCommonKeywords || hasCommonAuthor
    })
    .slice(0, 5)
}
