#!/usr/bin/env ts-node
import * as fp from './../'
import * as tap from 'tap'

const test = tap.test

test('anonymous function should be named mu1tip1e.composite.test', t => {
  t.plan(2)

  const fn = fp((fastify, opts, next) => {
    next()
  })

  t.is(fn[Symbol.for('plugin-meta')].name, 'mu1tip1e.composite.test')
  t.is(fn[Symbol.for('fastify.display-name')], 'mu1tip1e.composite.test')
})
