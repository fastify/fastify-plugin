#!/usr/bin/env ts-node
import * as fp from './../'
import * as tap from 'tap'

const test = tap.test

test('anonymous function should be named composite.test', (t: any) => {
  t.plan(1)

  const fn = fp((fastify, opts, next) => {
    next()
  })

  t.is(fn[Symbol.for('fastify.display-name')], 'composite.test')
})
