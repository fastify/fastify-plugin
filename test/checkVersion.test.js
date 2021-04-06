'use strict'

const { test } = require('tap')
const fp = require('../plugin')

test('checkVersion having require.main.filename', (t) => {
  const info = console.info
  t.ok(require.main.filename)
  t.teardown(() => {
    console.info = info
  })

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

test('checkVersion having no require.main.filename but process.argv[1]', (t) => {
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
    fastify: '^3.0.0'
  })

  t.end()
})

test('checkVersion having no require.main.filename and no process.argv[1]', (t) => {
  const filename = require.main.filename
  const argv = process.argv
  const info = console.info
  t.teardown(() => {
    require.main.filename = filename
    process.argv = argv
    console.info = info
  })

  require.main.filename = null
  process.argv[1] = null

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
