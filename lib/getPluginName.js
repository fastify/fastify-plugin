'use strict'

const FP_STACK_TRACE_REG = /at\s(?:.*\.)?plugin\s.*\n\s*(.*)/
const FILE_NAME_REG = /(\w*(\.\w*)*)\..*/

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

  // get last section of path and match for filename
  return m ? m[1].split(/[/\\]/).slice(-1)[0].match(FILE_NAME_REG)[1] : 'anonymous'
}
module.exports.extractPluginName = extractPluginName
