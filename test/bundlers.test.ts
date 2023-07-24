
import {FastifyInstance, FastifyPluginOptions} from 'fastify'
import {test} from 'tap'
import fp from '../plugin'

test('webpack removes require.main.filename', (t) => {
  const filename = require.main?.filename
  const info = console.info
  t.teardown(() => {
    if(require.main && filename) {
      require.main.filename = filename
    }
    console.info = info
  })

  if(require.main) {
    require.main.filename = ''
  }

  console.info = function (msg: string) {
    t.fail('logged: ' + msg)
  }

  fp((_fastify, _opts, next) => {
    next()
  }, {
    fastify: '^4.0.0'
  })

  t.end()
})

test('support faux modules', (t) => {
  const plugin = fp((_fastify, _opts, next) => {
    next()
  })

  t.equal(plugin.default, plugin)
  t.end()
})

test('support faux modules does not override existing default field in babel module', (t) => {
  const module = {
    default: (_fastify: any, _opts: any, next: () => any) => next()
  }

  Reflect.set(module.default, 'default', 'Existing default field');

  const plugin = fp(module)

  t.equal(plugin.default, 'Existing default field')
  t.end()
})

test('support ts named imports', (t) => {
  const plugin = fp((_fastify, _opts, next) => {
    next()
  }, {
    name: 'hello'
  })

  t.equal(plugin.hello, plugin)
  t.end()
})

test('from kebab-case to camelCase', (t) => {
  const plugin = fp((_fastify, _opts, next) => {
    next()
  }, {
    name: 'hello-world'
  })

  t.equal(plugin.helloWorld, plugin)
  t.end()
})

test('from @-prefixed named imports', (t) => {
  const plugin = fp((_fastify, _opts, next) => {
    next()
  }, {
    name: '@hello/world'
  })

  t.equal(plugin.helloWorld, plugin)
  t.end()
})

test('from @-prefixed named kebab-case to camelCase', (t) => {
  const plugin = fp((_fastify, _opts, next) => {
    next()
  }, {
    name: '@hello/my-world'
  })

  t.equal(plugin.helloMyWorld, plugin)
  t.end()
})

test('from kebab-case to camelCase multiple words', (t) => {
  const plugin = fp((_fastify, _opts, next) => {
    next()
  }, {
    name: 'hello-long-world'
  })

  t.equal(plugin.helloLongWorld, plugin)
  t.end()
})

test('from kebab-case to camelCase multiple words does not override', (t) => {
  const fn = (_fastify: FastifyInstance, _opts: FastifyPluginOptions, next: () => void) => {
    next()
  }

  const foobar = {}
  fn.helloLongWorld = foobar

  const plugin = fp(fn, {
    name: 'hello-long-world'
  })

  t.equal(plugin.helloLongWorld, foobar)
  t.end()
})
