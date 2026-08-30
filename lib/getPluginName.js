'use strict'

const fpStackTracePattern = /at\s(?:.*\.)?plugin\s.*\n\s*(.*)/

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
  const m = stack.match(fpStackTracePattern)

  if (!m) return 'anonymous'

  // get last section of path and remove the location suffix and extension
  const fileName = m[1].split(/[/\\]/).slice(-1)[0]
  return fileName.replace(/:\d+:\d+\)?$/, '').replace(/\.[^.]+$/, '')
}
module.exports.extractPluginName = extractPluginName
