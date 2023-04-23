import cac from 'cac';
import Pilot from '../src/scripts/pilot';
import pkg from '../package.json';
import { JsonParse, Log, formatPmJSON, stdoutLogo } from '../src/scripts/utils';
import process from 'process';

async function main() {

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
        .option(
            '--nginxConfig [nginxConfig]',
            '[nginxConfig] 提供项目nginx配置，可参考readme.md'
        )
        .action(async (options) => {

            if (options?.pilotConfig && options?.projectConfig) {

                const pilotJson = JsonParse(options.pilotConfig);
                const projectJSon = JsonParse(options.projectConfig);
                const nginxJson = JsonParse(options.nginxConfig);

                await pilot.startDeploy({
                    pilotCofig: pilotJson,
                    projectConfig: projectJSon,
                    nginxConfig: nginxJson
                });

                return;
            }
            await pilot.starDeploytWork();
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
            '--nginxConfig <nginxConfig>',
            '<nginxConfig> 提供项目nginx配置，可参考readme.md'
        )
        .action(async (options) => {

            if (options?.pilotConfig && options?.projectConfig) {

                const pilotJson = JsonParse(options.pilotConfig);
                const projectJSon = JsonParse(options.projectConfig);
                const nginxJson = JsonParse(options?.nginxConfig);

                await pilot.startRollBackJob({
                    pilotCofig: pilotJson,
                    projectConfig: projectJSon,
                    nginxConfig: nginxJson
                });

                return;
            }
            await pilot.rollBackWork();
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
                const pilotJson = JsonParse(options.pilotConfig);
                const list = await pilot.getServiceList(pilotJson);
                const filterList = formatPmJSON(JsonParse(list));
                process.stdout.write(JSON.stringify(filterList));
            } else {
                const list = await pilot.getServiceWorks();
                Log.success(`${list}`);
            }
        });

    // 获取服务列表
    cli
        .command('stopService <id>', '停止pm2的服务id')
        .alias('stps')
        .option(
            '--pilotConfig <pilotConfig>',
            '<pilotConfig> 提供git仓库/服务器配置，可参考readme.md'
        )
        .action(async (id, options) => {
            if (options?.pilotConfig) {
                const pilotJson = JsonParse(options.pilotConfig);
                await pilot.stopPm2Service(pilotJson, id);
                return;
            }
            await pilot.stopPm2Work(id);
        });

    cli
        .command('startService <id>', '停止pm2的服务id')
        .alias('stps')
        .option(
            '--pilotConfig <pilotConfig>',
            '<pilotConfig> 提供git仓库/服务器配置'
        )
        .action(async (id, options) => {

            if (options?.pilotConfig) {
                const pilotJson = JsonParse(options.pilotConfig);
                await pilot.startPm2Service(pilotJson, id);
                return;
            }
            await pilot.startPm2Work(id);
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


