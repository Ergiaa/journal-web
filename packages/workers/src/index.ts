#!/usr/bin/env bun
import './jobs/crawl-source'
import './jobs/update-citations'
import { startScheduler, stopScheduler, getSchedulerStatus } from './scheduler'

console.log('🚀 Journal Web Workers starting...')
console.log()

// Start the scheduler
startScheduler()

// Log status
const status = getSchedulerStatus()
console.log(`   Scheduler running: ${status.running}`)
status.schedules.forEach(schedule => console.log(`   - ${schedule}`))
console.log()

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down workers...')
  stopScheduler()
  console.log('👋 Goodbye!')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down workers...')
  stopScheduler()
  console.log('👋 Goodbye!')
  process.exit(0)
})

console.log('✅ Workers ready and waiting for jobs...')
console.log('   Press Ctrl+C to stop\n')
