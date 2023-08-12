// https://github.com/TypeStrong/ts-node#missing-types:~:text=Another%20option%20is%20triple%2Dslash%20directives
//
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../typings/benchmark-async.d.ts" />

import fp from 'fastify-plugin'
import fpts from '../plugin'
import Benchmark from 'benchmark-async'
import fastify, { FastifyInstance } from 'fastify'

import { workerData, parentPort, MessagePort } from 'worker_threads'
import assert from 'assert'

function throwIfParentPortIsNull (port: typeof parentPort | null): asserts port is MessagePort {
  assert.ok(port !== null, 'this script needs to be run as a worker thread')
}

type FpOrFpTs = typeof fp | typeof fpts

const numberOfPlugins = 10
const suite = new Benchmark.Suite({
  name: workerData.name,
  minSamples: 100,
  async: true,
  delay: 0
})

let fastifyInstance: null | FastifyInstance = null

function registerDependencies (fastifyInstance: FastifyInstance, fpLike: FpOrFpTs): PromiseLike<unknown> {
  for (const dependencyName of (workerData.requiredDependencies as string[] | undefined) ?? []) {
    void fastifyInstance.register(
      fpLike(
        (_fastify, _opts, next) => next(),
        {
          name: dependencyName
        }
      )
    )
  }

  const promise = fastifyInstance.register(
    (_fastify, _opts, next) => next()
  )

  return promise
}

function registerDecorators (fastifyInstance: FastifyInstance, fpLike: FpOrFpTs): void {
  for (const decoratorName of (workerData.metadata.decorators?.fastify as string[] | undefined) ?? []) {
    fastifyInstance.decorate(
      decoratorName,
      fpLike(
        (_fastify, _opts, next) => next(),
        {
          name: decoratorName
        }
      )
    )
  }

  for (const decoratorName of (workerData.metadata.decorators?.reply as string[] | undefined) ?? []) {
    fastifyInstance.decorateReply(
      decoratorName,
      fpLike(
        (_fastify, _opts, next) => next(),
        {
          name: decoratorName
        }
      )
    )
  }
}

function registerPlugins (fastifyInstance: FastifyInstance, fpLike: FpOrFpTs): void {
  for (let i = 0; i < numberOfPlugins; i++) {
    void fastifyInstance.register(
      fpLike(
        (_fastify, _opts, next) => next(),
        workerData.metadata
      )
    )
  }
}

function generateSetupFunction (fpLike: FpOrFpTs) {
  return function fn (deferred: { suResolve: () => void }) {
    fastifyInstance = fastify()

    registerDecorators(fastifyInstance, fpLike)

    void registerDependencies(fastifyInstance, fpLike).then(() => {
      assert.ok(fastifyInstance !== null, 'fastify instance is not initialized')

      registerPlugins(fastifyInstance, fpLike)
      deferred.suResolve()
    })
  }
}

function functionToBench (deferred: { resolve: () => void }): void {
  assert.ok(fastifyInstance !== null, 'fastify instance is not initialized')

  void fastifyInstance.ready().then(() => {
    deferred.resolve()
  })
}

function benchmarkTeardown (deferred: { tdResolve: () => void }): void {
  if (fastifyInstance == null) {
    throw new Error('fastifyInstance is not initialized')
  }

  fastifyInstance.close()
    .then(() => {
      deferred.tdResolve()
    })
    .catch((err) => { throw err })
}

suite
  .add(
    'Fastify Plugin',
    {
      setup: generateSetupFunction(fp),
      fn: functionToBench,
      teardown: benchmarkTeardown,
      defer: true
    }
  )
  .add(
    'Fastify Plugin Typescript',
    {
      setup: generateSetupFunction(fpts),
      fn: functionToBench,
      teardown: benchmarkTeardown,
      defer: true
    }
  )
  .on('start', function () {
    throwIfParentPortIsNull(parentPort)

    parentPort.postMessage(`Benchmark for ${String(workerData.name)}`)
  })
  .on('cycle', function (event: Event) {
    throwIfParentPortIsNull(parentPort)

    parentPort.postMessage(String(event.target))
  })
  .on('complete', function () {
    throwIfParentPortIsNull(parentPort)
    const fastestSuite = suite.filter('fastest').shift()

    parentPort.postMessage('Fastest is ' + String(fastestSuite.name))
  })
  .run()
