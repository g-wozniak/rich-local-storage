const fs = require('fs')

const package = require('../dist/package.json')

package.devDependencies = {}
package.scripts = {
    "deploy": "yarn publish --access public"
}
package.main = 'index.js'
package.types = 'index.d.ts'

try {
    fs.writeFileSync('./dist/package.json', JSON.stringify(package, null, 2))
} catch (err) {
    console.error(err)
}