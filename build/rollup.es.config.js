import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';

export default {
    entry: 'src/components/index.js',
    external: ['node_modules', 'vue', 'lodash', 'cloudinary-core'],
    plugins: [
        vue({ compileTemplate: true, css: false }),
        json(),
        buble({
            transforms: {
                dangerousForOf: true,
            },
        }),
        filesize(),
    ],
    targets: [{ dest: `dist/belt-vue.esm.js`, format: 'es' }],
};