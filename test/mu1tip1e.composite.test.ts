import { test } from 'tap'
import fp from '../plugin'

test('anonymous function should be named mu1tip1e.composite.test', t => {
  t.plan(2)

  const fn = fp((_fastify, _opts, next: () => void) => {
    next()
  })

  t.equal(Reflect.get(fn, Symbol.for('plugin-meta')).name, 'mu1tip1e.composite.test-auto-0')
  t.equal(Reflect.get(fn, Symbol.for('fastify.display-name')), 'mu1tip1e.composite.test-auto-0')
})
