'use strict'

const t = require('tap')
const test = t.test
const fp = require('./')

test('anonymous function should be named composite.test', t => {
  t.plan(1)

  const fn = fp((fastify, opts, next) => {
    next()
  })

  t.is(fn[Symbol.for('fastify.display-name')], 'composite.test')
})
