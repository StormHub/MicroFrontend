// tslint:disable
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
const rewireUglify = require("./config/rewire-uglify");
module.exports = function override(config, env) {
    config = rewireReactHotLoader(config, env);
    //config = rewireSass(config, env);
    if (env === "production") {
        rewireUglify(config);
    }
    return config;
};

module.exports = {
    webpack: function(config, env) {
        config = rewireReactHotLoader(config, env);
        //config = rewireSass(config, env);
        if (env === "production") {
            rewireUglify(config);
        }
        return config;
    }
};
