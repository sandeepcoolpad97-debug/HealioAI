const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      // Force @reduxjs/toolkit to use CJS build (Metro has issues with its react-native/legacy-esm entry)
      if (moduleName === '@reduxjs/toolkit') {
        return {
          type: 'sourceFile',
          filePath: path.resolve(
            __dirname,
            'node_modules/@reduxjs/toolkit/dist/cjs/index.js'
          ),
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
