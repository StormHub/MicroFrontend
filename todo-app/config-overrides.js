// tslint:disable
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
module.exports = function override(config, env) {
    config = rewireReactHotLoader(config, env);
    return config;
};

module.exports = {
    webpack: function(config, env) {
        config = rewireReactHotLoader(config, env);

        // For micro frontend to be included into the main app
        config.optimization.runtimeChunk = false;
        config.optimization.splitChunks = {
            cacheGroups: {
                default: false
            }
        };

        /*
        config.externals = {
            react: 'React',
            'react-dom': 'ReactDOM'
        }
        */

        return config;
    }
};
