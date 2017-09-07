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

test('shpuld throw if the plugin is not a function', t => {
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
    fp(plugin, '>=0.10.0')
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('should throw if the fastify version does not satisfies the plugin requested version', t => {
  t.plan(1)

  function plugin (fastify, opts, next) {
    next()
  }

  const v = require('fastify/package.json').version
  try {
    fp(plugin, '1000.1000.1000')
    t.fail()
  } catch (e) {
    t.is(e.message, `fastify-plugin - expected '1000.1000.1000' fastify version, '${v}' is installed`)
  }
})

test('should throw if the version number is not a string', t => {
  t.plan(1)

  try {
    fp(() => {}, 12)
    t.fail()
  } catch (e) {
    t.is(e.message, 'fastify-plugin expects a version string as second parameter, instead got \'number\'')
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

  fp(plugin, '>= 0')
})
