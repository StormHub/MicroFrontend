// tslint:disable
/**
 * The e2e tests use testcafe-react-selectors to find components on a page. Mangling/compression makes this impossible so need to modify it to
 * NOT mangle the Component names (see Limitations on https://github.com/DevExpress/testcafe-react-selectors)
 * @param config
 * @returns {*}
 */
function rewireUglify(config) {
    const minimizer = config.optimization.minimizer[0];

    if (minimizer) {
        minimizer.options.terserOptions.compress.keep_fnames = true;
        minimizer.options.terserOptions.mangle.keep_fnames = true;
    }

    return config;
}

module.exports = rewireUglify;
