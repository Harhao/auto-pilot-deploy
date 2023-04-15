const fse = require("fs-extra");
const pkg = require("../package.json");
const path = require("path");
const { execSync } = require("child_process");

function build() {
    const outputDir = path.resolve(__dirname, "../dist");
    execSync(`rimraf ${outputDir} && tsc`);
    execSync(`cp -r ./src/ejs ./dist/src/ejs`);
    addShaBang();
}

async function addShaBang() {
    const fileContent = await fse.readFile(pkg.main, "utf-8");
    const contentWithShebang = `#!/usr/bin/env node\n${fileContent}`;
    await fse.writeFile(pkg.main, contentWithShebang);
}

build();
