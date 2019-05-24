/// <reference types="fastify" />

import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http'

/**
 * This function does three things for you:
 *   1. Add the `skip-override` hidden property
 *   2. Check bare-minimum version of Fastify
 *   3. Pass some custom metadata of the plugin to Fastify
 * @param fn Fastify plugin function
 * @param options Optional plugin options
 * @param next The `next` callback is not available when using `async`/`await`. If you do invoke a `next` callback in this situation unexpected behavior may occur.
 */
declare function fastifyPlugin<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse, T = any>(
  fn: fastify.Plugin<HttpServer, HttpRequest, HttpResponse, T> | { default: fastify.Plugin<HttpServer, HttpRequest, HttpResponse, T> },
  options?: fastifyPlugin.PluginOptions | string,
  next?: fastifyPlugin.nextCallback
): fastify.Plugin<HttpServer, HttpRequest, HttpResponse, T>;

declare namespace fastifyPlugin {
  type nextCallback = (err?: Error) => void;
  interface PluginOptions {
    /** Bare-minimum version of Fastify for your plugin, just add the semver range that you need. */
    fastify?: string,
    name?: string,
    /** Decorator dependencies for this plugin */
    decorators?: {
      fastify?: string[],
      reply?: string[],
      request?: string[]
    },
    /** The plugin dependencies */
    dependencies?: string[]
  }
}

export = fastifyPlugin;
