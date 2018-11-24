'use strict'

const semver = require('semver')
const console = require('console')

const fpStackTracePattern = /at\s{1}(?:.*\.)?plugin\s{1}.*\n\s*(.*)/
const fileNamePattern = /(\w*(\.\w*)*)\..*/

function plugin (fn, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError(`fastify-plugin expects a function, instead got a '${typeof fn}'`)
  }

  fn[Symbol.for('skip-override')] = true

  if (typeof options === 'string') {
    checkVersion(options)
    options = {}
  }

  if (typeof options !== 'object' || Array.isArray(options) || options === null) {
    throw new TypeError('The options object should be an object')
  }

  if (!options.name) {
    options.name = checkName(fn)
  }

  fn[Symbol.for('fastify.display-name')] = options.name

  if (options.fastify) {
    checkVersion(options.fastify)
    delete options.fastify
  }

  fn[Symbol.for('plugin-meta')] = options

  return fn
}

function checkName (fn) {
  if (fn.name.length > 0) return fn.name

  try {
    throw new Error('anonymous function')
  } catch (e) {
    const stack = e.stack
    const m = stack.match(fpStackTracePattern)

    // get last section of path and match for filename
    return m ? m[1].split(/[/\\]/).slice(-1)[0].match(fileNamePattern)[1] : 'anonymous'
  }
}

function checkVersion (version) {
  if (typeof version !== 'string') {
    throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof version}'`)
  }

  var fastifyVersion
  try {
    fastifyVersion = require('fastify/package.json').version.replace(/-rc\.\d+/, '')
  } catch (_) {
    console.info('fastify not found, proceeding anyway')
  }

  if (fastifyVersion && !semver.satisfies(fastifyVersion, version)) {
    throw new Error(`fastify-plugin - expected '${version}' fastify version, '${fastifyVersion}' is installed`)
  }
}

module.exports = plugin
