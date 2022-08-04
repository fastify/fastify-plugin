'use strict'

const { test } = require('tap')
const fp = require('../plugin')

test('webpack removes require.main.filename', (t) => {
  const filename = require.main.filename
  const info = console.info
  t.teardown(() => {
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
    fastify: '^4.0.0'
  })

  t.end()
})

test('support faux modules', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  })

  t.equal(plugin.default, plugin)
  t.end()
})

test('support faux modules does not override existing default field in babel module', (t) => {
  const module = {
    default: (fastify, opts, next) => next()
  }

  module.default.default = 'Existing default field'

  const plugin = fp(module)

  t.equal(plugin.default, 'Existing default field')
  t.end()
})

test('support ts named imports', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: 'hello'
  })

  t.equal(plugin.hello, plugin)
  t.end()
})

test('from kebab-case to camelCase', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: 'hello-world'
  })

  t.equal(plugin.helloWorld, plugin)
  t.end()
})

test('from @-prefixed named imports', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: '@hello/world'
  })

  t.equal(plugin.helloWorld, plugin)
  t.end()
})

test('from @-prefixed named kebab-case to camelCase', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: '@hello/my-world'
  })

  t.equal(plugin.helloMyWorld, plugin)
  t.end()
})

test('from kebab-case to camelCase multiple words', (t) => {
  const plugin = fp((fastify, opts, next) => {
    next()
  }, {
    name: 'hello-long-world'
  })

  t.equal(plugin.helloLongWorld, plugin)
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

  t.equal(plugin.helloLongWorld, foobar)
  t.end()
})
