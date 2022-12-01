'use strict'

const { test } = require('tap')
const toCamelCase = require('../lib/toCamelCase')

test('from kebab-case to camelCase', (t) => {
  t.plan(1)
  t.equal(toCamelCase('hello-world'), 'helloWorld')
})

test('from @-prefixed named imports', (t) => {
  t.plan(1)
  t.equal(toCamelCase('@hello/world'), 'helloWorld')
})

test('from @-prefixed named kebab-case to camelCase', (t) => {
  t.plan(1)
  t.equal(toCamelCase('@hello/my-world'), 'helloMyWorld')
})

test('from kebab-case to camelCase multiple words', (t) => {
  t.plan(1)
  t.equal(toCamelCase('hello-long-world'), 'helloLongWorld')
})
