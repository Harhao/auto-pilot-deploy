const fse = require("fs-extra");
const { execSync } = require('child_process');
const pkg = require('../package.json');


function build() {
    execSync('rimraf dist && tsc');
    addShaBang();
}

async function addShaBang() {
    const fileContent = await fse.readFile(pkg.main, 'utf-8');
    const contentWithShebang = `#!/usr/bin/env node\n${fileContent}`;
    await fse.writeFile(pkg.main, contentWithShebang)
}

build();

