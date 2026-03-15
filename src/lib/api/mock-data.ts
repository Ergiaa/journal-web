import type { Journal, SearchResult, SearchParams, Facets } from '@/types/journal'

const mockJournals: Journal[] = [
  // ─── AI / Machine Learning ─────────────────────────────────────────────────────
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing: A Comprehensive Survey',
    abstract: 'This paper presents a comprehensive survey of deep learning approaches applied to natural language processing tasks. We review recent advances in neural network architectures, attention mechanisms, and transformer models that have revolutionized the field.',
    authors: ['John Smith', 'Emily Chen', 'Michael Johnson'],
    publishedDate: '2024-03-15',
    journal: 'Journal of Artificial Intelligence Research',
    doi: '10.1234/jair.2024.001',
    keywords: ['deep learning', 'NLP', 'transformers', 'neural networks'],
    sourceUrl: 'https://arxiv.org/abs/2403.12345',
  },
  {
    id: '2',
    title: 'Transformer Architectures for Multi-Modal Learning: Vision and Language Integration',
    abstract: 'We propose a novel transformer architecture that seamlessly integrates visual and linguistic information. Our model achieves state-of-the-art performance on visual question answering and image captioning benchmarks.',
    authors: ['Sarah Williams', 'David Lee', 'Anna Martinez'],
    publishedDate: '2024-05-20',
    journal: 'Journal of Artificial Intelligence Research',
    doi: '10.1234/jair.2024.045',
    keywords: ['transformers', 'multi-modal', 'computer vision', 'NLP'],
    sourceUrl: 'https://arxiv.org/abs/2405.12345',
  },
  {
    id: '3',
    title: 'Reinforcement Learning for Autonomous Decision Making in Complex Environments',
    abstract: 'This study explores reinforcement learning algorithms for autonomous decision-making in complex, dynamic environments. We demonstrate significant improvements in sample efficiency and policy robustness.',
    authors: ['Kevin Zhang', 'Amanda White', 'Christopher Davis'],
    publishedDate: '2024-01-10',
    journal: 'Machine Learning Journal',
    doi: '10.5678/mlj.2024.012',
    keywords: ['reinforcement learning', 'autonomous systems', 'decision making'],
    sourceUrl: 'https://arxiv.org/abs/2401.12345',
  },
  {
    id: '4',
    title: 'Federated Learning: Privacy-Preserving Machine Learning at Scale',
    abstract: 'Federated learning enables model training across decentralized data sources without centralizing sensitive information. This paper addresses key challenges in communication efficiency and differential privacy.',
    authors: ['Lisa Thompson', 'Mark Anderson', 'Jennifer Taylor'],
    publishedDate: '2023-11-05',
    journal: 'Machine Learning Journal',
    doi: '10.5678/mlj.2023.089',
    keywords: ['federated learning', 'privacy', 'distributed systems', 'machine learning'],
    sourceUrl: 'https://arxiv.org/abs/2311.12345',
  },
  {
    id: '5',
    title: 'Explainable AI: Interpreting Deep Neural Network Decisions',
    abstract: 'As AI systems are deployed in high-stakes domains, explainability becomes crucial. We present novel methods for interpreting deep neural network decisions with human-understandable explanations.',
    authors: ['Robert Brown', 'Maria Garcia', 'James Wilson'],
    publishedDate: '2023-08-22',
    journal: 'Nature Machine Intelligence',
    doi: '10.1038/s42256-023-00123-4',
    keywords: ['explainable AI', 'interpretability', 'neural networks', 'transparency'],
    sourceUrl: 'https://www.nature.com/articles/s42256-023-00123-4',
  },
  {
    id: '6',
    title: 'Graph Neural Networks for Molecular Property Prediction',
    abstract: 'We apply graph neural networks to predict molecular properties for drug discovery. Our approach captures complex structural relationships and outperforms traditional fingerprint-based methods.',
    authors: ['Nicole Brown', 'Daniel Miller', 'Kevin Zhang'],
    publishedDate: '2024-02-14',
    journal: 'Drug Discovery Today',
    doi: '10.2345/ddt.2024.156',
    keywords: ['graph neural networks', 'drug discovery', 'molecular modeling', 'AI'],
    sourceUrl: 'https://www.cell.com/drug-discovery-today/fulltext/S2024.02.156',
  },

  // ─── Quantum Computing ────────────────────────────────────────────────────────
  {
    id: '7',
    title: 'Quantum Computing: Principles, Progress, and Prospects',
    abstract: 'Quantum computing represents a paradigm shift in computational capabilities. This review examines fundamental principles, surveys current hardware progress, and discusses prospective applications.',
    authors: ['Sarah Williams', 'David Lee', 'Robert Brown', 'Anna Martinez'],
    publishedDate: '2024-02-20',
    journal: 'Nature Quantum Information',
    doi: '10.5678/nqi.2024.042',
    keywords: ['quantum computing', 'qubits', 'quantum algorithms', 'cryptography'],
    sourceUrl: 'https://www.nature.com/articles/s41567-024-01234-5',
  },
  {
    id: '8',
    title: 'Quantum Error Correction: Towards Fault-Tolerant Quantum Computation',
    abstract: 'Quantum error correction is essential for building reliable quantum computers. We review recent advances in error-correcting codes and fault-tolerant architectures.',
    authors: ['Thomas Moore', 'Rachel Green', 'Paul Robinson'],
    publishedDate: '2024-04-08',
    journal: 'Nature Quantum Information',
    doi: '10.5678/nqi.2024.078',
    keywords: ['quantum computing', 'error correction', 'fault tolerance', 'qubits'],
    sourceUrl: 'https://www.nature.com/articles/s41567-024-07890-1',
  },
  {
    id: '9',
    title: 'Quantum Machine Learning: Algorithms and Applications',
    abstract: 'We explore the intersection of quantum computing and machine learning, presenting quantum algorithms that offer potential speedups for classical ML problems.',
    authors: ['Emma Harris', 'Andrew Kim', 'Samantha Wright'],
    publishedDate: '2023-09-15',
    journal: 'Physical Review Letters',
    doi: '10.1103/PhysRevLett.131.12345',
    keywords: ['quantum computing', 'machine learning', 'quantum algorithms', 'optimization'],
    sourceUrl: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.131.12345',
  },

  // ─── Climate & Environment ────────────────────────────────────────────────────
  {
    id: '10',
    title: 'Climate Change Impact on Global Biodiversity: A Meta-Analysis',
    abstract: 'We conducted a meta-analysis of 500+ studies examining climate change impacts on global biodiversity. Results indicate significant shifts in species distribution patterns.',
    authors: ['Maria Garcia', 'James Wilson'],
    publishedDate: '2024-01-10',
    journal: 'Global Change Biology',
    doi: '10.9012/gcb.2024.089',
    keywords: ['climate change', 'biodiversity', 'ecosystems', 'meta-analysis'],
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/38123456/',
  },
  {
    id: '11',
    title: 'Ocean Acidification: Impacts on Marine Ecosystems and Food Webs',
    abstract: 'Rising atmospheric CO2 levels are causing ocean acidification with profound effects on marine life. This study examines impacts across trophic levels and ecosystem functioning.',
    authors: ['Laura Martinez', 'Steven Clark', 'Jessica Lewis'],
    publishedDate: '2023-12-01',
    journal: 'Global Change Biology',
    doi: '10.9012/gcb.2023.156',
    keywords: ['climate change', 'ocean acidification', 'marine ecosystems', 'biodiversity'],
    sourceUrl: 'https://onlinelibrary.wiley.com/doi/10.9012/gcb.2023.156',
  },
  {
    id: '12',
    title: 'Carbon Sequestration in Forest Ecosystems: A Global Assessment',
    abstract: 'Forests play a critical role in carbon sequestration. We present a global assessment of carbon storage in different forest types and discuss management strategies.',
    authors: ['Patrick Turner', 'Olivia Scott', 'Rebecca Hall'],
    publishedDate: '2024-03-28',
    journal: 'Environmental Science & Technology',
    doi: '10.1021/est.2024.01234',
    keywords: ['climate change', 'carbon sequestration', 'forests', 'sustainability'],
    sourceUrl: 'https://pubs.acs.org/doi/10.1021/est.2024.01234',
  },
  {
    id: '13',
    title: 'Renewable Energy Storage Technologies: A Comparative Analysis',
    abstract: 'As renewable energy adoption accelerates, efficient storage solutions become critical. This analysis examines battery technologies, pumped hydro, and hydrogen-based systems.',
    authors: ['Paul Robinson', 'Emma Harris'],
    publishedDate: '2024-03-28',
    journal: 'Energy Storage Materials',
    doi: '10.6789/esm.2024.102',
    keywords: ['renewable energy', 'energy storage', 'batteries', 'sustainability'],
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S20240328',
  },
  {
    id: '14',
    title: 'Solar Energy Harvesting: Next-Generation Photovoltaic Technologies',
    abstract: 'We review emerging photovoltaic technologies including perovskite solar cells, tandem architectures, and organic photovoltaics, discussing efficiency improvements and commercialization prospects.',
    authors: ['Brian Adams', 'Andrew Kim', 'Samantha Wright'],
    publishedDate: '2023-10-15',
    journal: 'Energy Storage Materials',
    doi: '10.6789/esm.2023.089',
    keywords: ['renewable energy', 'solar cells', 'photovoltaics', 'sustainability'],
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S20231015',
  },

  // ─── Medicine & Biotechnology ─────────────────────────────────────────────────
  {
    id: '15',
    title: 'CRISPR-Cas9 Gene Editing: Ethical Considerations and Clinical Applications',
    abstract: 'CRISPR-Cas9 technology has opened new frontiers in genetic medicine. This paper explores ethical considerations and discusses current clinical trials for somatic cell therapies.',
    authors: ['Jennifer Taylor', 'Mark Anderson', 'Lisa Thompson'],
    publishedDate: '2023-12-05',
    journal: 'Nature Medicine',
    doi: '10.3456/nm.2023.156',
    keywords: ['CRISPR', 'gene editing', 'bioethics', 'clinical trials'],
    sourceUrl: 'https://www.nature.com/articles/nm.2023.156',
  },
  {
    id: '16',
    title: 'Gene Therapy for Inherited Retinal Diseases: Clinical Trial Results',
    abstract: 'We report results from a Phase III clinical trial of gene therapy for inherited retinal dystrophies, demonstrating significant improvements in visual function.',
    authors: ['Rebecca Hall', 'Patrick Turner', 'Olivia Scott'],
    publishedDate: '2024-04-12',
    journal: 'Nature Medicine',
    doi: '10.3456/nm.2024.078',
    keywords: ['gene therapy', 'clinical trials', 'ophthalmology', 'CRISPR'],
    sourceUrl: 'https://www.nature.com/articles/nm.2024.078',
  },
  {
    id: '17',
    title: 'Machine Learning for Drug Discovery: Recent Advances and Future Directions',
    abstract: 'Machine learning has emerged as a powerful tool in pharmaceutical research. This review covers deep learning for molecular property prediction and generative models for drug design.',
    authors: ['Kevin Zhang', 'Amanda White', 'Christopher Davis', 'Nicole Brown', 'Daniel Miller'],
    publishedDate: '2024-04-01',
    journal: 'Drug Discovery Today',
    doi: '10.2345/ddt.2024.301',
    keywords: ['machine learning', 'drug discovery', 'pharmaceuticals', 'AI'],
    sourceUrl: 'https://www.cell.com/drug-discovery-today/fulltext/S2024.04.001',
  },
  {
    id: '18',
    title: 'Antibody-Drug Conjugates: Design Principles and Clinical Applications',
    abstract: 'Antibody-drug conjugates represent a promising class of targeted cancer therapeutics. We discuss design principles, linker technologies, and clinical development strategies.',
    authors: ['John Smith', 'Emily Chen', 'Michael Johnson'],
    publishedDate: '2023-07-20',
    journal: 'Drug Discovery Today',
    doi: '10.2345/ddt.2023.234',
    keywords: ['drug discovery', 'cancer', 'antibodies', 'pharmaceuticals'],
    sourceUrl: 'https://www.cell.com/drug-discovery-today/fulltext/S2023.07.234',
  },
  {
    id: '19',
    title: 'Microbiome-Gut-Brain Axis: Implications for Mental Health',
    abstract: 'Emerging research reveals the critical role of the gut microbiome in mental health. This review synthesizes findings from microbiology, neuroscience, and psychiatry.',
    authors: ['Rebecca Hall', 'Patrick Turner', 'Olivia Scott'],
    publishedDate: '2023-12-20',
    journal: 'Nature Reviews Neuroscience',
    doi: '10.1234/nrn.2023.099',
    keywords: ['microbiome', 'gut-brain axis', 'mental health', 'neuroscience'],
    sourceUrl: 'https://www.nature.com/articles/nrn.2023.099',
  },
  {
    id: '20',
    title: 'Neuroplasticity and Rehabilitation: Mechanisms and Therapeutic Approaches',
    abstract: 'We examine the mechanisms of neuroplasticity following brain injury and discuss therapeutic approaches that harness plasticity for rehabilitation.',
    authors: ['Laura Martinez', 'Steven Clark', 'Jessica Lewis'],
    publishedDate: '2024-02-28',
    journal: 'Nature Reviews Neuroscience',
    doi: '10.1234/nrn.2024.045',
    keywords: ['neuroscience', 'neuroplasticity', 'rehabilitation', 'brain injury'],
    sourceUrl: 'https://www.nature.com/articles/nrn.2024.045',
  },

  // ─── Psychology & Social Sciences ─────────────────────────────────────────────
  {
    id: '21',
    title: 'The Psychology of Social Media: Understanding Digital Behavior',
    abstract: 'This study examines psychological factors influencing social media behavior. Through surveys of 10,000 participants across 15 countries, we identify patterns in digital addiction and social comparison.',
    authors: ['Laura Martinez', 'Steven Clark', 'Jessica Lewis'],
    publishedDate: '2024-02-14',
    journal: 'Journal of Social Psychology',
    doi: '10.4567/jsp.2024.078',
    keywords: ['social media', 'psychology', 'digital behavior', 'mental health'],
    sourceUrl: 'https://psycnet.apa.org/record/2024-02140-001',
  },
  {
    id: '22',
    title: 'Remote Work and Employee Well-Being: A Longitudinal Study',
    abstract: 'We conducted a two-year longitudinal study examining the effects of remote work on employee well-being, productivity, and work-life balance across multiple industries.',
    authors: ['Thomas Moore', 'Rachel Green', 'Paul Robinson'],
    publishedDate: '2023-11-30',
    journal: 'Journal of Social Psychology',
    doi: '10.4567/jsp.2023.156',
    keywords: ['psychology', 'remote work', 'well-being', 'workplace'],
    sourceUrl: 'https://psycnet.apa.org/record/2023-1130-001',
  },
  {
    id: '23',
    title: 'Cognitive Biases in Decision Making: Implications for Public Policy',
    abstract: 'This paper examines how cognitive biases affect decision-making at individual and policy levels, proposing evidence-based interventions to improve policy outcomes.',
    authors: ['James Wilson', 'Maria Garcia', 'Robert Brown'],
    publishedDate: '2024-01-25',
    journal: 'Journal of Social Psychology',
    doi: '10.4567/jsp.2024.012',
    keywords: ['psychology', 'cognitive biases', 'decision making', 'public policy'],
    sourceUrl: 'https://psycnet.apa.org/record/2024-0125-001',
  },

  // ─── Technology & Engineering ─────────────────────────────────────────────────
  {
    id: '24',
    title: 'Autonomous Vehicles: Technical Challenges and Regulatory Frameworks',
    abstract: 'The development of autonomous vehicles presents both technical and regulatory challenges. This paper reviews sensor fusion technologies, decision-making algorithms, and safety protocols.',
    authors: ['Andrew Kim', 'Samantha Wright', 'Brian Adams'],
    publishedDate: '2024-01-25',
    journal: 'IEEE Transactions on Intelligent Transportation Systems',
    doi: '10.8901/tits.2024.045',
    keywords: ['autonomous vehicles', 'self-driving', 'regulation', 'AI safety'],
    sourceUrl: 'https://ieeexplore.ieee.org/document/2024.045',
  },
  {
    id: '25',
    title: 'Cybersecurity in the Internet of Things: Vulnerabilities and Countermeasures',
    abstract: 'The proliferation of IoT devices introduces significant security challenges. We analyze common vulnerabilities and propose comprehensive countermeasures for IoT ecosystems.',
    authors: ['David Lee', 'Sarah Williams', 'Anna Martinez'],
    publishedDate: '2023-09-28',
    journal: 'IEEE Transactions on Intelligent Transportation Systems',
    doi: '10.8901/tits.2023.089',
    keywords: ['cybersecurity', 'IoT', 'networks', 'security'],
    sourceUrl: 'https://ieeexplore.ieee.org/document/2023.089',
  },
  {
    id: '26',
    title: 'Blockchain Technology in Supply Chain Management: Opportunities and Challenges',
    abstract: 'This study investigates blockchain applications in supply chain management, analyzing case studies from major industries and discussing implementation challenges.',
    authors: ['Thomas Moore', 'Rachel Green'],
    publishedDate: '2023-11-18',
    journal: 'International Journal of Logistics',
    doi: '10.7890/ijl.2023.201',
    keywords: ['blockchain', 'supply chain', 'transparency', 'logistics'],
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S20231118',
  },
  {
    id: '27',
    title: 'Smart Cities: Integrating IoT and AI for Urban Sustainability',
    abstract: 'We present a framework for integrating IoT sensors and AI analytics to optimize urban infrastructure, reduce energy consumption, and improve quality of life.',
    authors: ['Emma Harris', 'Paul Robinson', 'Andrew Kim'],
    publishedDate: '2024-05-10',
    journal: 'International Journal of Logistics',
    doi: '10.7890/ijl.2024.045',
    keywords: ['smart cities', 'IoT', 'sustainability', 'urban planning'],
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S20240510',
  },

  // ─── Physics & Materials Science ──────────────────────────────────────────────
  {
    id: '28',
    title: 'Superconductivity at Room Temperature: Progress and Prospects',
    abstract: 'The quest for room-temperature superconductivity continues. This review examines recent claims, methodological challenges, and the path forward for this transformative technology.',
    authors: ['Robert Brown', 'Thomas Moore', 'Rachel Green'],
    publishedDate: '2023-06-15',
    journal: 'Physical Review Letters',
    doi: '10.1103/PhysRevLett.130.12345',
    keywords: ['superconductivity', 'materials science', 'physics', 'energy'],
    sourceUrl: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.130.12345',
  },
  {
    id: '29',
    title: 'Metamaterials for Light Manipulation: From Theory to Applications',
    abstract: 'Metamaterials offer unprecedented control over electromagnetic waves. We review design principles and applications in imaging, cloaking, and energy harvesting.',
    authors: ['Samantha Wright', 'Brian Adams', 'Andrew Kim'],
    publishedDate: '2024-03-05',
    journal: 'Physical Review Letters',
    doi: '10.1103/PhysRevLett.132.12345',
    keywords: ['metamaterials', 'photonics', 'materials science', 'physics'],
    sourceUrl: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.12345',
  },

  // ─── Additional AI/ML Papers ───────────────────────────────────────────────────
  {
    id: '30',
    title: 'Large Language Models: Capabilities, Limitations, and Ethical Implications',
    abstract: 'Large language models have demonstrated remarkable capabilities. This paper examines their strengths, limitations, and ethical considerations for responsible deployment.',
    authors: ['Emily Chen', 'John Smith', 'Michael Johnson'],
    publishedDate: '2024-04-20',
    journal: 'Journal of Artificial Intelligence Research',
    doi: '10.1234/jair.2024.078',
    keywords: ['large language models', 'NLP', 'AI ethics', 'transformers'],
    sourceUrl: 'https://arxiv.org/abs/2404.12345',
  },
  {
    id: '31',
    title: 'Computer Vision for Medical Imaging: Deep Learning Approaches',
    abstract: 'We review deep learning methods for medical image analysis, covering applications in radiology, pathology, and ophthalmology with clinical validation results.',
    authors: ['Amanda White', 'Kevin Zhang', 'Christopher Davis'],
    publishedDate: '2023-08-10',
    journal: 'Nature Machine Intelligence',
    doi: '10.1038/s42256-023-00456-7',
    keywords: ['computer vision', 'medical imaging', 'deep learning', 'healthcare'],
    sourceUrl: 'https://www.nature.com/articles/s42256-023-00456-7',
  },
  {
    id: '32',
    title: 'Neural Architecture Search: Automating Deep Learning Model Design',
    abstract: 'Neural architecture search automates the design of deep learning models. We present efficient search strategies and demonstrate state-of-the-art results on benchmark tasks.',
    authors: ['Mark Anderson', 'Lisa Thompson', 'Jennifer Taylor'],
    publishedDate: '2023-05-25',
    journal: 'Machine Learning Journal',
    doi: '10.5678/mlj.2023.045',
    keywords: ['neural architecture search', 'autoML', 'deep learning', 'optimization'],
    sourceUrl: 'https://arxiv.org/abs/2305.12345',
  },

  // ─── Additional Biology/Ecology Papers ─────────────────────────────────────────
  {
    id: '33',
    title: 'Pollinator Decline: Causes, Consequences, and Conservation Strategies',
    abstract: 'Pollinator populations are declining globally. This meta-analysis examines drivers of decline and proposes evidence-based conservation strategies.',
    authors: ['James Wilson', 'Maria Garcia', 'Patrick Turner'],
    publishedDate: '2023-04-12',
    journal: 'Global Change Biology',
    doi: '10.9012/gcb.2023.045',
    keywords: ['biodiversity', 'conservation', 'ecosystems', 'climate change'],
    sourceUrl: 'https://onlinelibrary.wiley.com/doi/10.9012/gcb.2023.045',
  },
  {
    id: '34',
    title: 'Coral Reef Resilience: Mechanisms and Management Implications',
    abstract: 'Coral reefs face unprecedented threats from climate change. We examine mechanisms of coral resilience and discuss management strategies for reef conservation.',
    authors: ['Olivia Scott', 'Rebecca Hall', 'Laura Martinez'],
    publishedDate: '2024-02-08',
    journal: 'Environmental Science & Technology',
    doi: '10.1021/est.2024.00567',
    keywords: ['climate change', 'marine ecosystems', 'biodiversity', 'conservation'],
    sourceUrl: 'https://pubs.acs.org/doi/10.1021/est.2024.00567',
  },

  // ─── Additional Medicine Papers ────────────────────────────────────────────────
  {
    id: '35',
    title: 'Immunotherapy for Cancer: Mechanisms and Clinical Outcomes',
    abstract: 'Immunotherapy has revolutionized cancer treatment. This review covers checkpoint inhibitors, CAR-T cells, and combination strategies with clinical outcome data.',
    authors: ['Jennifer Taylor', 'Mark Anderson', 'Kevin Zhang'],
    publishedDate: '2023-10-30',
    journal: 'Nature Medicine',
    doi: '10.3456/nm.2023.234',
    keywords: ['immunotherapy', 'cancer', 'clinical trials', 'drug discovery'],
    sourceUrl: 'https://www.nature.com/articles/nm.2023.234',
  },
  {
    id: '36',
    title: 'Precision Medicine: Genomics-Guided Treatment Selection',
    abstract: 'Precision medicine tailors treatments to individual genetic profiles. We discuss genomic profiling methods and their application in oncology and rare diseases.',
    authors: ['Christopher Davis', 'Nicole Brown', 'Daniel Miller'],
    publishedDate: '2024-01-18',
    journal: 'Nature Medicine',
    doi: '10.3456/nm.2024.012',
    keywords: ['precision medicine', 'genomics', 'clinical trials', 'personalized treatment'],
    sourceUrl: 'https://www.nature.com/articles/nm.2024.012',
  },

  // ─── Additional Quantum Papers ─────────────────────────────────────────────────
  {
    id: '37',
    title: 'Quantum Sensing: Applications in Medicine and Biology',
    abstract: 'Quantum sensors offer unprecedented sensitivity for biological measurements. We review applications in medical imaging, protein structure determination, and cellular sensing.',
    authors: ['David Lee', 'Sarah Williams', 'Emma Harris'],
    publishedDate: '2023-07-08',
    journal: 'Nature Quantum Information',
    doi: '10.5678/nqi.2023.123',
    keywords: ['quantum computing', 'quantum sensing', 'medical imaging', 'biology'],
    sourceUrl: 'https://www.nature.com/articles/s41567-023-01234-5',
  },

  // ─── Additional Psychology Papers ──────────────────────────────────────────────
  {
    id: '38',
    title: 'Memory Consolidation During Sleep: Neural Mechanisms',
    abstract: 'Sleep plays a crucial role in memory consolidation. This study uses neuroimaging to elucidate the neural mechanisms underlying sleep-dependent memory processing.',
    authors: ['Steven Clark', 'Jessica Lewis', 'Laura Martinez'],
    publishedDate: '2023-03-20',
    journal: 'Nature Reviews Neuroscience',
    doi: '10.1234/nrn.2023.045',
    keywords: ['neuroscience', 'memory', 'sleep', 'brain'],
    sourceUrl: 'https://www.nature.com/articles/nrn.2023.045',
  },
  {
    id: '39',
    title: 'Emotional Intelligence in Leadership: A Meta-Analysis',
    abstract: 'We conducted a meta-analysis examining the relationship between emotional intelligence and leadership effectiveness across organizational contexts.',
    authors: ['Rachel Green', 'Thomas Moore', 'Paul Robinson'],
    publishedDate: '2024-05-05',
    journal: 'Journal of Social Psychology',
    doi: '10.4567/jsp.2024.089',
    keywords: ['psychology', 'emotional intelligence', 'leadership', 'workplace'],
    sourceUrl: 'https://psycnet.apa.org/record/2024-0505-001',
  },

  // ─── Additional Technology Papers ──────────────────────────────────────────────
  {
    id: '40',
    title: 'Edge Computing for Real-Time IoT Applications',
    abstract: 'Edge computing reduces latency for IoT applications. We present architectures and case studies for real-time processing in smart manufacturing and healthcare.',
    authors: ['Brian Adams', 'Andrew Kim', 'Samantha Wright'],
    publishedDate: '2023-06-28',
    journal: 'IEEE Transactions on Intelligent Transportation Systems',
    doi: '10.8901/tits.2023.123',
    keywords: ['edge computing', 'IoT', 'real-time systems', 'networks'],
    sourceUrl: 'https://ieeexplore.ieee.org/document/2023.123',
  },
]

// ─── Facet computation ────────────────────────────────────────────────────────

function computeFacets(journals: Journal[]): Facets {
  const journalCounts = new Map<string, number>()
  const authorCounts = new Map<string, number>()
  const yearCounts = new Map<string, number>()
  const keywordCounts = new Map<string, number>()

  for (const j of journals) {
    journalCounts.set(j.journal, (journalCounts.get(j.journal) ?? 0) + 1)

    for (const author of j.authors) {
      authorCounts.set(author, (authorCounts.get(author) ?? 0) + 1)
    }

    const year = j.publishedDate.slice(0, 4)
    yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1)

    for (const kw of j.keywords ?? []) {
      keywordCounts.set(kw, (keywordCounts.get(kw) ?? 0) + 1)
    }
  }

  const toSorted = (map: Map<string, number>) =>
    Array.from(map.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)

  return {
    journals: toSorted(journalCounts),
    authors: toSorted(authorCounts),
    years: toSorted(yearCounts),
    keywords: toSorted(keywordCounts),
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function getMockJournals(): Journal[] {
  return mockJournals
}

export function searchMockJournals(params: SearchParams): SearchResult {
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
  let filtered = mockJournals.filter((journal) => {
    if (!q) return true
    return (
      journal.title.toLowerCase().includes(lowerQuery) ||
      journal.abstract?.toLowerCase().includes(lowerQuery) ||
      journal.authors.some((a) => a.toLowerCase().includes(lowerQuery)) ||
      journal.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)) ||
      journal.journal.toLowerCase().includes(lowerQuery)
    )
  })

  // 2. Author filter
  if (authorFilter) {
    const lowerAuthor = authorFilter.toLowerCase()
    filtered = filtered.filter((j) =>
      j.authors.some((a) => a.toLowerCase().includes(lowerAuthor))
    )
  }

  // 3. Journal filter (multi-select)
  if (journalFilter && journalFilter.length > 0) {
    filtered = filtered.filter((j) => journalFilter.includes(j.journal))
  }

  // 4. Keyword filter (multi-select)
  if (keywordFilter && keywordFilter.length > 0) {
    filtered = filtered.filter((j) =>
      j.keywords?.some((k) => keywordFilter.includes(k))
    )
  }

  // 5. Year range filter
  if (yearFrom !== undefined || yearTo !== undefined) {
    filtered = filtered.filter((j) => {
      const year = parseInt(j.publishedDate.slice(0, 4))
      if (yearFrom !== undefined && year < yearFrom) return false
      if (yearTo !== undefined && year > yearTo) return false
      return true
    })
  }

  // 6. Compute facets from the full filtered set (before pagination)
  const facets = computeFacets(filtered)

  // 7. Sort
  if (sortBy !== 'relevance') {
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return b.publishedDate.localeCompare(a.publishedDate)
        case 'date_asc':
          return a.publishedDate.localeCompare(b.publishedDate)
        case 'title_asc':
          return a.title.localeCompare(b.title)
        case 'author_asc':
          return (a.authors[0] ?? '').localeCompare(b.authors[0] ?? '')
        default:
          return 0
      }
    })
  }

  // 8. Paginate
  const start = (page - 1) * pageSize
  const paginatedJournals = filtered.slice(start, start + pageSize)

  return {
    journals: paginatedJournals,
    total: filtered.length,
    page,
    pageSize,
    facets,
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
