import t from 'tap'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import fp from '../../plugin.js'

t.test('esm base support', async t => {
  fp((fastify, opts, next) => {
    next()
  }, {
    fastify: '^3.0.0'
  })

  t.end()
})

t.test('esm support: should throw if the fastify version does not satisfies the plugin requested version', t => {
  t.plan(1)

  function plugin (fastify, opts, next) {
    next()
  }

  const packageJson = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../node_modules/fastify/package.json')))

  const v = packageJson.version.replace(/-(rc|alpha)\.\d+/, '')
  try {
    fp(plugin, { fastify: '1000.1000.1000' })
    t.fail()
  } catch (e) {
    t.is(e.message, `fastify-plugin: plugin - expected '1000.1000.1000' fastify version, '${v}' is installed`)
  }
})
