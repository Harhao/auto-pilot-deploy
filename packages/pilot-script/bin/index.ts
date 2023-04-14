import cac from "cac";
import Pilot from "../src/scripts/pilot";
import pkg from "../package.json";
import { Log, writeLogo } from "../src/scripts/utils";
import process from "process";

function main() {
    writeLogo("pilot");

    const cli = cac(`${pkg.name}`);
    const pilot = new Pilot();

    cli
        .command("configure [envname]", "[envname]提供部署github项目")
        .alias("cf")
        .action((options) => {
            console.log(options);
            // pilot.startWork();
        });

    cli
        .command("clone [project]", "[project]提供部署github项目")
        .alias("dp")
        .action((gitUrl: string) => {
            pilot.startWork();
        });

    // 部署命令
    cli
        .command("deploy", "部署github项目")
        .alias("dpl")
        .option(
            "--pilotConfig [pilotConfig]",
            "[pilotConfig]提供git仓库/服务器配置，可参考readme.md"
        )
        .option(
            "--projectConfig [projectConfig]",
            "[projectConfig] 提供项目配置，可参考readme.md"
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
        .command("rollback", "回滚github项目")
        .alias("rlb")
        .option(
            "--pilotConfig <pilotConfig>",
            "<pilotConfig> 提供git仓库/服务器配置，可参考readme.md"
        )
        .option(
            "--projectConfig <projectConfig>",
            "<projectConfig> 提供项目配置，可参考readme.md"
        )
        .option(
            "--rollback <projectConfig>",
            "<projectConfig> 提供项目配置，可参考readme.md"
        )
        .action((options) => {
            pilot.rollBackWork();
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
