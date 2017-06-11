# fastify-plugin

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/fastify/fastify-plugin.svg?branch=master)](https://travis-ci.org/fastify/fastify-plugin)

`fastify-plugin` is a plugin helper for [Fastify](https://github.com/fastify/fastify).  
When you build plugins for Fastify and you want that them to be accessible in the same context where you require them, you have two ways:
1. Use the `skip-override` hidden property
2. Use this module

#### Usage
`fastify-plugin` can do two things for you:
- Add the `skip-override` hidden property
- Check the bare-minimum version of Fastify

Example:
```js
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next) {
  // your plugin code
  next()
})
```

If you need to set a bare-minimum version of Fastify for your plugin, just add the [semver](http://semver.org/) range that you need:
```js
const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next) {
  // your plugin code
  next()
}, '0.x')
```

You can check [here](https://github.com/npm/node-semver#ranges) how to define a `semver` range.

## Acknowledgements

This project is kindly sponsored by:
- [nearForm](http://nearform.com)
- [LetzDoIt](http://www.letzdoitapp.com/)

## License

Licensed under [MIT](./LICENSE).
