'use strict'

const { basename, extname } = require('node:path')

const FP_STACK_TRACE_REG = /at\s(?:.*\.)?plugin\s.*\n\s*(.*)/

module.exports = function getPluginName (fn) {
  if (fn.name.length > 0) return fn.name

  const stackTraceLimit = Error.stackTraceLimit
  Error.stackTraceLimit = 10
  try {
    throw new Error('anonymous function')
  } catch (e) {
    Error.stackTraceLimit = stackTraceLimit
    return extractPluginName(e.stack)
  }
}

function extractPluginName (stack) {
  const m = stack.match(FP_STACK_TRACE_REG)

  if (!m) return 'anonymous'

  const fileName = basename(m[1].replaceAll('\\', '/')).replace(/:\d+:\d+\)?$/, '')
  return basename(fileName, extname(fileName))
}
module.exports.extractPluginName = extractPluginName
