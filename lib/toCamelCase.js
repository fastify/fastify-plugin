'use strict'

const KEBAB_REG = /-(.)/g

function upperFirst (_match, char) {
  return char.toUpperCase()
}

module.exports = function toCamelCase (name) {
  if (name[0] === '@') {
    name = name.slice(1).replace('/', '-')
  }
  return name.replace(KEBAB_REG, upperFirst)
}
