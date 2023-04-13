import cac from 'cac';
import Pilot from '../scripts/pilot';
import pkg from '../package.json';
import { Log, writeLogo } from '../scripts/utils';
import process from 'process';


function main() {

    writeLogo('pilot');

    const cli = cac(`${pkg.name}`);
    const pilot = new Pilot();
    cli
        .command('configure [envname]', '[envname]提供部署github项目')
        .alias('cf')
        .action((envname: string) => {
            pilot.startWork();
        });


    cli
        .command('clone [project]', '[project]提供部署github项目')
        .alias('dp')
        .action((gitUrl: string) => {
            pilot.startWork();
        });
    cli
        .command('deploy [project]', '[project]提供部署github项目')
        .alias('dp')
        .action((project: string) => {
            pilot.startWork();
        });

    cli.help();
    cli.parse();
}

try {
    main();
} catch (e) {
    Log.error(`pilot run error ${e}`);
    process.exit(0);
}



