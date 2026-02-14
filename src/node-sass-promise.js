const sass = require('sass');

const render = (config) => {
    const options = {
        style: config.outputStyle || 'expanded'
    };

    if (config.sourceMap) {
        options.sourceMap = true;
    }

    return sass.compileAsync(config.file, options).then(result => {
        return {
            css: Buffer.from(result.css),
            map: result.sourceMap ? Buffer.from(result.sourceMap) : null
        };
    });
}

module.exports = {
    render
}