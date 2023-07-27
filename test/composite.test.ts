import { test } from 'tap'
import fp from '../plugin'

test('anonymous function should be named composite.test0', t => {
  t.plan(2)

  const fn = fp((_fastify, _opts, next) => {
    next()
  })

  t.equal(Reflect.get(fn, Symbol.for('plugin-meta')).name, 'composite.test-auto-0')
  t.equal(Reflect.get(fn, Symbol.for('fastify.display-name')), 'composite.test-auto-0')
})
