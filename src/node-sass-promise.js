const sass = require('node-sass');

const render = (config) => {
    return new Promise((resolve,reject) => {
        return sass.render(config, (err, result) => {
            if(err)
                return reject(err)
            resolve(result);
        })
    })
}

module.exports = {
    render
}