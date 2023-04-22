import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';

import loading from 'loading-cli';

export const stdoutLogo = (logoText: string) => {
    // 使用 figlet 将文本转换为 ASCII 艺术字体
    const asciiArt = figlet.textSync(logoText);
    // 使用 chalk 添加颜色和样式
    const styledText = chalk.green(asciiArt);
    // 使用 boxen 绘制带边框的框架
    const box = boxen(styledText, { padding: 0, align: 'center', borderColor: 'yellow' });

    console.log(box);
    // 打印图案和符号
    console.log('\n');
};


export const showLoading = (loadingText: string) => {
    const load = loading({
        text: loadingText,
        color: 'green',
        interval: 100,
        stream: process.stdout,
        frames: [
            '🕐',
            '🕑',
            '🕒',
            '🕓',
            '🕔',
            '🕕',
            '🕖',
            '🕗',
            '🕘',
            '🕙',
            '🕚',
        ],
    }).start();
    return load;
}