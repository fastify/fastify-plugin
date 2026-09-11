'use strict'

/**
 * @param { import('../types/index').PluginMetadata | string } metadata
 * @returns { import('../types/index').PluginMetadata }
 */
function prepareMetadata (metadata) {
  const normalizedMetadata = typeof metadata === 'string' ? { fastify: metadata } : metadata
  const isInvalidMetadata = (
    normalizedMetadata === null ||
    typeof normalizedMetadata !== 'object' ||
    Array.isArray(normalizedMetadata)
  )
  if (isInvalidMetadata) {
    const actualType = metadata === null
      ? 'null'
      : (Array.isArray(metadata) ? 'array' : typeof metadata)
    throw new TypeError(`The metadata should be an object or version string, not '${actualType}'`)
  }
  const fastifyVersion = normalizedMetadata.fastify
  if (fastifyVersion !== undefined && typeof fastifyVersion !== 'string') {
    throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof fastifyVersion}'`)
  }
  return normalizedMetadata
}

module.exports = prepareMetadata
