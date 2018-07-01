'use strict'

const t = require('tap')
const test = t.test
const fp = require('./../')

test('anonymous function should be named mu1tip1e.composite.test', t => {
  t.plan(2)

  const fn = fp((fastify, opts, next) => {
    next()
  })

  t.is(fn[Symbol.for('plugin-meta')].name, 'mu1tip1e.composite.test')
  t.is(fn[Symbol.for('fastify.display-name')], 'mu1tip1e.composite.test')
})
