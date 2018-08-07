import babel from 'rollup-plugin-babel';

const es = process.env.NODE_ENV === 'es';

export default {
  entry: 'src/createApp.js',
  dest: `${es ? 'es' : 'lib'}/dedux-app.js`,
  format: es ? 'esm' : 'umd',
  moduleName: 'deduxApp',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
