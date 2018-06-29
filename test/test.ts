import * as fp from './../'
import * as tap from 'tap'

const test = tap.test

test('should set anonymous function name to file it was called from', t => {
  t.plan(2)

  const fn = fp((fastify, opts, next) => {
    next()
  })

  t.is(fn[Symbol.for('plugin-meta')].name, 'test')
  t.is(fn[Symbol.for('fastify.display-name')], 'test')
})