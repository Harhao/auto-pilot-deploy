import logSymbols from 'log-symbols';
import chalk from 'chalk';

const log = console.log;

export class Log {
  public static warn(msg: string) {
    log(logSymbols.warning, chalk.yellow(msg));
  }
  public static success(msg: string) {
    log(logSymbols.success, chalk.green(msg));
  }
  public static error(msg: string) {
    log(logSymbols.error, chalk.red(msg));
  }
  public static info(msg: string) {
    log(logSymbols.info, chalk.white(msg));
  }
}
