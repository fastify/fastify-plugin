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

test('support ts named imports', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: 'hello'
  })

  t.is(plugin.hello, plugin)
  t.end()
})

test('from kebabo-case to camelCase', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: 'hello-world'
  })

  t.is(plugin.helloWorld, plugin)
  t.end()
})

test('from kebab-case to camelCase multiple words', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: 'hello-long-world'
  })

  t.is(plugin.helloLongWorld, plugin)
  t.end()
})

test('from kebab-case to camelCase multiple words does not override', (t) => {
  const fn = (fastify, opts, next) => {
    next()
  }

  const foobar = {}
  fn.helloLongWorld = foobar

  const plugin = fp(fn, {
    name: 'hello-long-world'
  })

  t.is(plugin.helloLongWorld, foobar)
  t.end()
})
