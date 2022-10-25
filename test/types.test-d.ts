import { expectAssignable, expectError, expectNotAssignable, expectType, } from 'tsd';
import { FastifyPluginOptions, FastifyPluginAsync } from 'fastify';

// ESM default-import style
import fp1, { PluginOptions } from '../plugin';
let opts1a!: PluginOptions
let opts1b!: fp1.PluginOptions
let opts1c!: fp1.default.PluginOptions
expectAssignable<Function>(fp1);
expectAssignable<Function>(fp1.default);
expectAssignable<FastifyPluginOptions>(opts1a);
expectAssignable<FastifyPluginOptions>(opts1b);
expectAssignable<FastifyPluginOptions>(opts1c);
expectType<FastifyPluginAsync>(fp1(async () => {}));
expectType<FastifyPluginAsync>(fp1.default(async () => {}));

// ESM alternative import style
import { default as fp2, PluginOptions as PluginOptions2 } from '../plugin';
let opts2a!: PluginOptions2
let opts2b!: fp2.PluginOptions
let opts2c!: fp2.default.PluginOptions
expectAssignable<Function>(fp2);
expectAssignable<Function>(fp2.default);
expectAssignable<FastifyPluginOptions>(opts2a);
expectAssignable<FastifyPluginOptions>(opts2b);
expectAssignable<FastifyPluginOptions>(opts2c);
expectType<FastifyPluginAsync>(fp2(async () => {}));
expectType<FastifyPluginAsync>(fp2.default(async () => {}));

// Star-import style
import * as fp3 from '../plugin';
let opts3a!: PluginOptions2
let opts3b!: fp3.PluginOptions
let opts3c!: fp3.default.PluginOptions
expectNotAssignable<Function>(fp3);
expectAssignable<Function>(fp3.default);
expectAssignable<FastifyPluginOptions>(opts3a);
expectAssignable<FastifyPluginOptions>(opts3b);
expectAssignable<FastifyPluginOptions>(opts3c);
expectError(fp3(async () => {}));
expectType<FastifyPluginAsync>(fp3.default(async () => {}));
