'use strict'

const t = require('tap')
const test = t.test
const { Plugin } = require('../')

test('should return the class with the skip-override Symbol', t => {
  t.plan(1)

  class TestPlugin {}
  Plugin()(TestPlugin)
  const plugin = new TestPlugin()

  t.ok(plugin[Symbol.for('skip-override')])
})

test('Should accept an option object', t => {
  t.plan(2)

  const opts = { hello: 'world' }

  class TestPlugin {}
  Plugin(opts)(TestPlugin)
  const plugin = new TestPlugin()

  t.ok(plugin[Symbol.for('skip-override')])
  t.deepEqual(plugin[Symbol.for('plugin-meta')], opts)
})
