'use strict'

const { test } = require('tap')
const fp = require('../plugin')

test('webpack removes require.main.filename', (t) => {
  const filename = require.main.filename
  const info = console.info
  t.tearDown(() => {
    require.main.filename = filename
    console.info = info
  })

  require.main.filename = null

  console.info = function (msg) {
    t.fail('logged: ' + msg)
  }

  fp((fastify, opts, next) => {
    next()
  }, {
    fastify: '^3.0.0'
  })

  t.end()
})

test('support faux modules', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  })

  t.is(plugin.default, plugin)
  t.end()
})
