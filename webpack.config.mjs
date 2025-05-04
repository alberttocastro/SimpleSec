import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import { merge } from 'webpack-merge';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* eslint-enable */

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';

// List of native Node.js modules to exclude from bundling
const nodeModules = ['sequelize', 'sqlite3', 'pg', 'pg-hstore', 'tedious', 'mysql2'];

const commonConfig = {
  devtool: isEnvDevelopment ? 'source-map' : false,
  mode: isEnvProduction ? 'production' : 'development',
  output: { path: path.join(__dirname, 'dist') },
  node: { __dirname: false, __filename: false },
  plugins: [
    // Remove the problematic NormalModuleReplacementPlugin that was removing .js extensions
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        extensions: ['.js', '.json', '.ts', '.tsx'],
      }),
    ],
    fallback: {
      path: false,
      fs: false,
      crypto: false,
      // Add more Node.js built-in modules to fallback
      stream: false,
      buffer: false,
      util: false,
      assert: false,
      os: false,
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      // Enhanced rule for ESM modules in node_modules
      {
        test: /\.m?js$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          // This helps handle the missing extensions in ESM modules
          fullySpecified: false
        }
      }
    ],
  },
};

// Helper function to create externals object from nodeModules array
function createExternals() {
  const externals = {};
  nodeModules.forEach(mod => {
    externals[mod] = `commonjs ${mod}`;
  });
  return externals;
}

const mainConfig = merge(commonConfig, {
  entry: './src/main/main.ts',
  target: 'electron-main',
  output: { filename: 'main.bundle.js' },
  // Even for main process, explicitly define native modules as externals
  // to prevent webpack from trying to bundle them
  externals: createExternals(),
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'package.json',
          to: 'package.json',
          transform: (content, _path) => {
            const jsonContent = JSON.parse(content);
            const electronVersion = jsonContent.devDependencies.electron;

            delete jsonContent.devDependencies;
            delete jsonContent.optionalDependencies;
            delete jsonContent.scripts;
            delete jsonContent.build;

            jsonContent.main = './main.bundle.js';
            jsonContent.scripts = { start: 'electron ./main.bundle.js' };
            jsonContent.devDependencies = { electron: electronVersion };

            return JSON.stringify(jsonContent, undefined, 2);
          },
        },
      ],
    }),
  ],
});

const preloadConfig = merge(commonConfig, {
  entry: './src/preload/preload.ts',
  target: 'electron-preload',
  output: { filename: 'preload.bundle.js' },
  // Preload process also needs these defined as externals
  externals: createExternals(),
});

const rendererConfig = merge(commonConfig, {
  entry: './src/renderer/renderer.tsx',
  target: 'electron-renderer',
  output: {
    filename: 'renderer.bundle.js',
    publicPath: './', // Ensure the correct public path
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    // Enhanced ignore plugin for database modules
    new webpack.IgnorePlugin({
      resourceRegExp: new RegExp(`^(${nodeModules.join('|')})$`)
    })
  ],
  // Enhanced externals configuration for renderer
  externals: [
    createExternals(),
    // Handle sub-dependencies of Sequelize
    /^sequelize\/.*/,
    // Handle sub-paths of sqlite3
    /^sqlite3\/.*/,
    // Handle any other problematic node modules
    /^pg-native$/,
    /^bufferutil$/,
    /^utf-8-validate$/,
  ],
});

export default [mainConfig, preloadConfig, rendererConfig];
