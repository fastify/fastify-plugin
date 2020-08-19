import t from 'tap'
import fp from '../../plugin.js'

t.test('esm support', async t => {
  fp((fastify, opts, next) => {
    next()
  }, {
    fastify: '^3.0.0'
  })

  t.end()
})
