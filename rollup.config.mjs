import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'src/index.ts',
	output: {
		name: 'KaiwareExample',
		file: 'build/index.ts',
		format: 'iife',
		sourcemap: true
	},
	context: 'window',
	plugins: [
		copy({ targets: [{ src: 'public/**/*', dest: 'build' }] }),
		babel({
			extensions: ['.js', '.ts', '.mjs', '.cjs', '.html'],
			babelHelpers: 'runtime',
			exclude: ['node_modules/@babel/**'],
			presets: [
				[
					'@babel/preset-env',
					{
						targets: { firefox: '48' },
						exclude: ['@babel/plugin-transform-regenerator']
					}
				]
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				[
					'@babel/plugin-transform-runtime',
					{
						useESModules: true,
						regenerator: false,
						corejs: false
					}
				]
			]
		}),
		nodeResolve({ browser: true }),
		commonjs(),
		typescript({
			sourceMap: true,
			inlineSources: true,
			compilerOptions: {
				target: 'ES2015',
				module: 'ES2015'
			},
			outDir: 'build'
		})
	]
};
