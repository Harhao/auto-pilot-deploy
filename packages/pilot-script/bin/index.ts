import cac from 'cac';
import Pilot from '../src/scripts/pilot';
import pkg from '../package.json';
import { Log, formatPmJSON, stdoutLogo } from '../src/scripts/utils';
import process from 'process';

function main() {

    const cli = cac(`${pkg.name}`);
    const pilot = new Pilot();

    // 部署命令
    cli
        .command('deploy', '部署github项目')
        .alias('dpl')
        .option(
            '--pilotConfig [pilotConfig]',
            '[pilotConfig]提供git仓库/服务器配置，可参考readme.md'
        )
        .option(
            '--projectConfig [projectConfig]',
            '[projectConfig] 提供项目配置，可参考readme.md'
        )
        .action((options) => {
            if (options?.pilotConfig && options?.projectConfig) {
                const { pilotConfig, projectConfig } = options;
                const pilotJson = JSON.parse(pilotConfig);
                const projectJSon = JSON.parse(projectConfig);
                pilot.startDeploy({
                    pilotCofig: pilotJson,
                    projectConfig: projectJSon,
                });
                return;
            }
            pilot.startWork();
        });

    // 回滚命令
    cli
        .command('rollback', '回滚github项目')
        .alias('rlb')
        .option(
            '--pilotConfig <pilotConfig>',
            '<pilotConfig> 提供git仓库/服务器配置，可参考readme.md'
        )
        .option(
            '--projectConfig <projectConfig>',
            '<projectConfig> 提供项目配置，可参考readme.md'
        )
        .option(
            '--rollback <projectConfig>',
            '<projectConfig> 提供项目配置，可参考readme.md'
        )
        .action((options) => {
            pilot.rollBackWork();
        });


    // 获取服务列表
    cli
        .command('service', '获取pm2 运行服务列表')
        .alias('psl')
        .option(
            '--pilotConfig <pilotConfig>',
            '<pilotConfig> 提供git仓库/服务器配置，可参考readme.md'
        )
        .action(async (options) => {
            if (options?.pilotConfig) {
                const pilotJson = JSON.parse(options.pilotConfig);
                const list = await pilot.getServiceList(pilotJson);
                const filterList = formatPmJSON(JSON.parse(list));
                process.stdout.write(JSON.stringify(filterList));
            } else {
                const list = await pilot.getServiceWorks();
                Log.success(`${list}`);
            }
        });

    // 获取服务列表
    cli
        .command('stopService', '停止pm2 的服务')
        .alias('stps')
        .option(
            '--pilotConfig <pilotConfig>',
            '<pilotConfig> 提供git仓库/服务器配置，可参考readme.md'
        )
        .action(async (options) => {
           
        });

    cli.help();
    cli.parse();
}

try {
    main();
} catch (e) {
    Log.error(`pilot run error ${e}`);
    process.exit(0);
} finally {
    stdoutLogo('pilot');
}
