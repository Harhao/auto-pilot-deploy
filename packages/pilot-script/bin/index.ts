import cac from 'cac';
import Pilot from '../scripts/pilot';


const cli = cac();
cli
    .command('deploy [project]', '[project]提供部署github项目')
    .alias('dp')
    .action((project) => {
        const pilot = new Pilot();
        pilot.execute();
    });

cli.help();
cli.parse();






