export class BaseTool {
    public static getGitRepoParams(gitUrl: string) {
        const pattern = /github\.com\/([^\/]+)\/([^\/]+)\.git/;
        const match = gitUrl.match(pattern);
        return {
            owner: match[1],
            repo: match[2],
        };
    }
}