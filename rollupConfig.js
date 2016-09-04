import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/createApp.js',
  dest: 'lib/dedux-app.js',
  format: 'umd',
  moduleName: 'deduxApp',
  plugins: [ babel() ]
};
