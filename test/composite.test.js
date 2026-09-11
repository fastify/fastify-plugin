'use strict'

const { test } = require('node:test')
const { kPluginMeta, kDisplayName } = require('../lib/symbols')
const fp = require('..')

test('anonymous function should be named composite.test0', (t) => {
  t.plan(2)
  const fn = fp((_fastify, _opts, next) => {
    next()
  })

  t.assert.strictEqual(fn[kPluginMeta].name, 'composite.test-auto-0')
  t.assert.strictEqual(fn[kDisplayName], 'composite.test-auto-0')
})
