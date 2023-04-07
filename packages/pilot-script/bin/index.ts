import cac from 'cac';
import Pilot from '../scripts/pilot';
import pkg from '../package.json';


const cli = cac(`${pkg.name}`);
const pilot = new Pilot();

cli
    .command('configure [envname]', '[envname]提供部署github项目')
    .alias('cf')
    .action((envname: string) => {
        pilot.execute();
    });


cli
    .command('clone [project]', '[project]提供部署github项目')
    .alias('dp')
    .action((gitUrl: string) => {
        pilot.execute();
    });
cli
    .command('deploy [project]', '[project]提供部署github项目')
    .alias('dp')
    .action((project: string) => {
        pilot.execute();
    });

cli.help();
cli.parse();






