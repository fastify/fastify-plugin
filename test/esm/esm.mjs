import { test } from 'node:test'
import fp from '../../plugin.js'

test('esm base support', (t) => {
  fp((fastify, opts, next) => {
    next()
  }, {
    fastify: '^5.0.0'
  })
  t.assert.ok(true, 'fp function called without throwing an error')
})
