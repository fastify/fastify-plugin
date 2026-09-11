'use strict'

const KEBAB_REG = /-(.)/g

/**
 * @param { string } name
 * @returns { string }
 */
function toCamelCase (name) {
  if (name[0] === '@') {
    name = name.slice(1).replace('/', '-')
  }
  return name.replace(KEBAB_REG, upperFirst)
}

/**
 * @param { string } char
 * @returns { string }
 */
function upperFirst (_, char) {
  return char.toUpperCase()
}

module.exports = toCamelCase
