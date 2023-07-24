import t from 'tap'

import fp from '../../plugin.js'

t.test('esm base support', async t => {
  fp((_fastify, _opts, next) => {
    next()
  }, {
    fastify: '^3.0.0'
  })

  t.end()
})
