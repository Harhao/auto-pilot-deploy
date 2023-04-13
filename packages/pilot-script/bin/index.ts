import cac from 'cac';
import Pilot from '../scripts/pilot';
import pkg from '../package.json';
import Log from '../scripts/utils/log';

process.on('unhandledRejection', (reason, promise) => {
    Log.error(`Unhandled Rejection at: ${promise}\n` + `Reason: ${reason}`);
    // 进行错误处理，例如发送警报、日志记录等等
});

process.on('uncaughtException', (err, origin) => {
    // 进行错误处理，例如发送警报、日志记录等等
    Log.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});


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






