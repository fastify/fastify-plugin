# fastify-plugin

[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/fastify-plugin.svg)](https://greenkeeper.io/)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/fastify/fastify-plugin.svg?branch=master)](https://travis-ci.org/fastify/fastify-plugin)

`fastify-plugin` is a plugin helper for [Fastify](https://github.com/fastify/fastify).

When you build plugins for Fastify and you want that them to be accessible in the same context where you require them, you have two ways:
1. Use the `skip-override` hidden property
2. Use this module

In addition if you use this module when creating new plugins, you can declare the dependencies, the name and the expected Fastify version that your plugin needs.

#### Usage
`fastify-plugin` can do three things for you:
- Add the `skip-override` hidden property
- Check the bare-minimum version of Fastify
- Pass some custom metadata of the plugin to Fastify

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
}, { fastify: '0.x' })
```

If you need to check the Fastify version only, you can pass just the version string.

You can check [here](https://github.com/npm/node-semver#ranges) how to define a `semver` range.

You can also pass some metadata that will be handled by Fastify, such as the dependencies of your plugin.
```js
const fp = require('fastify-plugin')

function plugin (fastify, opts, next) {
  // your plugin code
  next()
}

module.exports = fp(plugin, {
  fastify: '0.x',
  decorators: {
    fastify: ['plugin1', 'plugin2'],
    reply: ['compress']
  },
  dependencies: ['plugin1-name', 'plugin2-name']
})
```

## Acknowledgements

This project is kindly sponsored by:
- [nearForm](http://nearform.com)
- [LetzDoIt](http://www.letzdoitapp.com/)

## License

Licensed under [MIT](./LICENSE).
