import fp from '../fastify-plugin';
import { FastifyPlugin } from 'fastify';
import { expectType, expectError } from 'tsd'

const testPlugin: FastifyPlugin = (inst, opts, next) => {}
expectType<FastifyPlugin>(fp(testPlugin))
expectType<FastifyPlugin>(fp(testPlugin, '3.x'))
expectType<FastifyPlugin>(fp(testPlugin, { fastify: '3.x' }))

expectError(fp()) // missing function
expectError(fp(testPlugin, { invalidProp: '' })) // bad FPOptions prop
