import { test } from 'tap'
import fp from '../plugin'

test('checkVersion having require.main.filename', (t) => {
  const info = console.info
  t.ok(require.main?.filename)
  t.teardown(() => {
    console.info = info
  })

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

test('checkVersion having no require.main.filename but process.argv[1]', (t) => {
  const filename = require.main?.filename
  const info = console.info
  t.teardown(() => {
    if ((require.main != null) && filename) {
      require.main.filename = filename
    }
    console.info = info
  })

  if (require.main != null) {
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

test('checkVersion having no require.main.filename and no process.argv[1]', (t) => {
  const filename = require.main?.filename
  const argv = process.argv
  const info = console.info
  t.teardown(() => {
    if ((require.main != null) && filename) {
      require.main.filename = filename
    }
    process.argv = argv
    console.info = info
  })

  if (require.main != null) {
    require.main.filename = ''
  }
  process.argv[1] = ''

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
