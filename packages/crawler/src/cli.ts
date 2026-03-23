#!/usr/bin/env bun
import { parseArgs } from 'util'
import { CrawlPipeline } from './pipeline'
import { listAdapters } from './adapters/index'

interface CliOptions {
  source: string
  since?: string
  until?: string
  limit?: number
  categories?: string[]
  help?: boolean
}

function printHelp() {
  console.log(`
📚 Journal Web Crawler CLI

Usage: bun run cli --source=<source> [options]

Options:
  --source, -s      Source to crawl (required)
                    Available: ${listAdapters().join(', ')}
  --since           Start date (YYYY-MM-DD)
  --until           End date (YYYY-MM-DD)
  --limit, -l       Maximum papers to fetch
  --categories, -c  Comma-separated list of categories
                    (e.g., 'cs.AI,cs.LG' for arXiv)
  --help, -h        Show this help message

Examples:
  bun run cli --source=arxiv --limit=50
  bun run cli -s arxiv --since=2024-01-01 --categories=cs.AI,cs.LG
`)
}

function parseCliArgs(): CliOptions {
  try {
    const { values } = parseArgs({
      args: Bun.argv,
      options: {
        source: { type: 'string', short: 's' },
        since: { type: 'string' },
        until: { type: 'string' },
        limit: { type: 'string', short: 'l' },
        categories: { type: 'string', short: 'c' },
        help: { type: 'boolean', short: 'h' },
      },
      strict: true,
      allowPositionals: true,
    })

    return {
      source: values.source || '',
      since: values.since,
      until: values.until,
      limit: values.limit ? parseInt(values.limit, 10) : undefined,
      categories: values.categories ? values.categories.split(',') : undefined,
      help: values.help,
    }
  } catch (error) {
    console.error(`Error parsing arguments: ${error}`)
    process.exit(1)
  }
}

async function main() {
  const options = parseCliArgs()

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  if (!options.source) {
    console.error('❌ Error: --source is required')
    printHelp()
    process.exit(1)
  }

  const availableSources = listAdapters()
  if (!availableSources.includes(options.source)) {
    console.error(`❌ Error: Unknown source "${options.source}"`)
    console.error(`   Available sources: ${availableSources.join(', ')}`)
    process.exit(1)
  }

  // Validate dates
  if (options.since) {
    const date = new Date(options.since)
    if (isNaN(date.getTime())) {
      console.error(`❌ Error: Invalid date format for --since: ${options.since}`)
      console.error('   Expected format: YYYY-MM-DD')
      process.exit(1)
    }
  }

  if (options.until) {
    const date = new Date(options.until)
    if (isNaN(date.getTime())) {
      console.error(`❌ Error: Invalid date format for --until: ${options.until}`)
      console.error('   Expected format: YYYY-MM-DD')
      process.exit(1)
    }
  }

  const pipeline = new CrawlPipeline()
  
  console.log(`\n🔍 Starting crawl configuration:`)
  console.log(`   Source: ${options.source}`)
  if (options.since) console.log(`   Since: ${options.since}`)
  if (options.until) console.log(`   Until: ${options.until}`)
  if (options.limit) console.log(`   Limit: ${options.limit}`)
  if (options.categories) console.log(`   Categories: ${options.categories.join(', ')}`)
  console.log()

  const result = await pipeline.crawl(options.source, {
    since: options.since,
    until: options.until,
    limit: options.limit,
    categories: options.categories,
  })

  // Exit with error code if there were errors
  if (result.errors.length > 0) {
    process.exit(1)
  }
}

main().catch(error => {
  console.error(`❌ Unexpected error: ${error}`)
  process.exit(1)
})
