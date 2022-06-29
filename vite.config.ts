import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

function CustomHmr() {
	return {
		name: 'custom-hmr',
		enforce: 'post',
		// HMR
		handleHotUpdate({ server }) {
			server.ws.send({
				type: 'full-reload',
				path: '*'
			});

		},
	}
}

export default defineConfig({
	plugins: [solidPlugin(), CustomHmr()],
	build: {
		target: 'esnext',
		polyfillDynamicImport: false,
	}
});
