import * as fp from './../'
import * as tap from 'tap'

const test = tap.test

test('anonymous function should be named composite.test', (t: any) => {
  t.plan(2)

  const fn = fp((fastify, opts, next) => {
    next()
  })

  t.is(fn[Symbol.for('plugin-meta')].name, 'composite.test')
  t.is(fn[Symbol.for('fastify.display-name')], 'composite.test')
})
