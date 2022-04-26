const chmodr = require("chmodr");

async function chmod(path, mode) {
    return new Promise<*>((resolve, reject) => {
        chmodr(path, mode, () => {
            resolve()
        })
    })
}

module.exports = chmod