export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13')
];

export const server_loads = [0,2];

export const dictionary = {
		"/": [~3],
		"/about": [7],
		"/blog": [~8],
		"/blog/[slug]": [~9],
		"/dashboard": [~10,[2]],
		"/dashboard/create": [~11,[2]],
		"/dashboard/edit/[slug]": [~12,[2]],
		"/(auth)/login": [~4],
		"/(auth)/logout": [5],
		"/newsletter": [13],
		"/(auth)/register": [~6]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';