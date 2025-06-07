import {fileURLToPath} from 'node:url';
import { mergeConfig,defineConfig} from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
    viteConfig, 
    defineConfig({
        test: {
            globals: true,
            environment: 'happy-dom',
            css: true,
            includeSource: ['src/**/*.{ts,js}'],
        }
    })
)