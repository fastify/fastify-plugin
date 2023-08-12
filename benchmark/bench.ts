import { Worker } from 'worker_threads'
import path from 'path'
import { PluginMetadata } from '../types'

const BENCH_WORKER_PATH = path.join(__dirname, 'bench-worker.ts')

interface BenchmarkCase {
  name: string
  requiredDependencies?: string[]
  metadata: PluginMetadata
}

const benchmarkCases: BenchmarkCase[] = [
  {
    name: 'simple case',
    metadata: {}
  },
  {
    name: 'fastify version checking',
    metadata: {
      fastify: '4.x'
    }
  },
  {
    name: 'fastify dependencies checking',
    requiredDependencies: ['plugin1-name', 'plugin2-name'],
    metadata: {
      dependencies: ['plugin1-name', 'plugin2-name']
    }
  },
  {
    name: 'fastify decorators checking',
    metadata: {
      decorators: {
        fastify: ['plugin1', 'plugin2'],
        reply: ['compress']
      }
    }
  }
]

async function runBenchmark (benchmarkCase: BenchmarkCase): Promise<string> {
  const worker = new Worker(BENCH_WORKER_PATH, { workerData: benchmarkCase })

  return await new Promise((resolve, reject) => {
    worker.on('error', reject)

    let result = ''

    worker.on('message', (msg: string) => {
      result += msg + '\n'
    })

    worker.on('exit', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
}

/*
runBenchmark(benchmarkCases[3]).catch((err) => {
  console.log('An error has occured: ', err)
})
*/

async function runBenchmarks (): Promise<void> {
  for (const benchmarkCase of benchmarkCases) {
    const result = await runBenchmark(benchmarkCase)
    console.log(result)
  }
}

runBenchmarks().catch((err) => {
  console.log('An error has occured: ', err)
})
