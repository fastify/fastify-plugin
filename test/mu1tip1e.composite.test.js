'use strict'

const { test } = require('node:test')
const { kPluginMeta, kDisplayName } = require('../lib/symbols')
const fp = require('..')

test('anonymous function should be named mu1tip1e.composite.test', (t) => {
  t.plan(2)

  const fn = fp((_fastify, _opts, next) => {
    next()
  })

  t.assert.strictEqual(fn[kPluginMeta].name, 'mu1tip1e.composite.test-auto-0')
  t.assert.strictEqual(fn[kDisplayName], 'mu1tip1e.composite.test-auto-0')
})
