'use strict'

const t = require('tap')
const proxyquire = require('proxyquire')
const test = t.test
const fp = require('./')

test('fastify-plugin is a function', t => {
  t.plan(1)
  t.type(fp, 'function')
})

test('should return the function with the skip-override Symbol', t => {
  t.plan(1)

  function plugin (fastify, opts, next) {
    next()
  }

  fp(plugin)
  t.ok(plugin[Symbol.for('skip-override')])
})

test('should throw if the plugin is not a function', t => {
  t.plan(1)

  try {
    fp('plugin')
    t.fail()
  } catch (e) {
    t.is(e.message, 'fastify-plugin expects a function, instead got a \'string\'')
  }
})

test('should check the fastify version', t => {
  t.plan(1)

  function plugin (fastify, opts, next) {
    next()
  }

  try {
    fp(plugin, { fastify: '>=0.10.0' })
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('should check the fastify version', t => {
  t.plan(1)

  function plugin (fastify, opts, next) {
    next()
  }

  try {
    fp(plugin, '>=0.10.0')
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('the options object should be an object', t => {
  t.plan(2)

  try {
    fp(() => {}, null)
    t.fail()
  } catch (e) {
    t.is(e.message, 'The options object should be an object')
  }

  try {
    fp(() => {}, [])
    t.fail()
  } catch (e) {
    t.is(e.message, 'The options object should be an object')
  }
})

test('should throw if the fastify version does not satisfies the plugin requested version', t => {
  t.plan(1)

  function plugin (fastify, opts, next) {
    next()
  }

  const v = require('fastify/package.json').version.replace(/-rc\.\d+/, '')
  try {
    fp(plugin, { fastify: '1000.1000.1000' })
    t.fail()
  } catch (e) {
    t.is(e.message, `fastify-plugin - expected '1000.1000.1000' fastify version, '${v}' is installed`)
  }
})

test('should throw if the version number is not a string', t => {
  t.plan(1)

  try {
    fp(() => {}, { fastify: 12 })
    t.fail()
  } catch (e) {
    t.is(e.message, 'fastify-plugin expects a version string, instead got \'number\'')
  }
})

test('should not throw if fastify is not found', t => {
  t.plan(1)

  const fp = proxyquire('./index.js', {
    'fastify/package.json': null,
    console: {
      info: function (msg) {
        t.is(msg, 'fastify not found, proceeding anyway')
      }
    }
  })

  function plugin (fastify, opts, next) {
    next()
  }

  fp(plugin, { fastify: '>= 0' })
})

test('Should accept an option object', t => {
  t.plan(2)

  const opts = { hello: 'world' }

  function plugin (fastify, opts, next) {
    next()
  }

  fp(plugin, opts)
  t.ok(plugin[Symbol.for('skip-override')])
  t.deepEqual(plugin[Symbol.for('plugin-meta')], opts)
})

test('Should accept an option object and checks the version', t => {
  t.plan(2)

  const opts = { hello: 'world', fastify: '>=0.10.0' }

  function plugin (fastify, opts, next) {
    next()
  }

  fp(plugin, opts)
  t.ok(plugin[Symbol.for('skip-override')])
  delete opts.version
  t.deepEqual(plugin[Symbol.for('plugin-meta')], opts)
})

test('should throw if the fastify version does not satisfies the plugin requested version', t => {
  t.plan(1)

  function plugin (fastify, opts, next) {
    next()
  }

  const v = require('fastify/package.json').version.replace(/-rc\.\d+/, '')
  try {
    fp(plugin, { fastify: '1000.1000.1000' })
    t.fail()
  } catch (e) {
    t.is(e.message, `fastify-plugin - expected '1000.1000.1000' fastify version, '${v}' is installed`)
  }
})
