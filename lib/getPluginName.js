'use strict'

const STACK_TRACE = /at\s(?:.*\.)?plugin\s.*\n\s*(.*)/
const FILE_NAME = /(\w*(\.\w*)*)\..*/

/**
 * @param { import('../types/index').FastifyPluginFunction } fn
 * @returns { string }
 */
function getPluginName (fn) {
  if (fn.name.length > 0) {
    return fn.name
  }
  const stackTraceLimit = Error.stackTraceLimit
  Error.stackTraceLimit = 10
  try {
    throw new Error('anonymous function')
  } catch (e) {
    Error.stackTraceLimit = stackTraceLimit
    return extractPluginName(e.stack)
  }
}

/**
 * @param { string } stackTrace
 * @returns { string }
 */
function extractPluginName (stackTrace) {
  const match = stackTrace.match(STACK_TRACE)
  if (!match) {
    return 'anonymous'
  }
  const fileName = match[1].split(/[/\\]/).pop()
  return fileName.match(FILE_NAME)[1]
}

module.exports = getPluginName
module.exports.extractPluginName = extractPluginName
