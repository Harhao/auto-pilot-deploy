export const getRepoName = (url: string) => {
    const pattern = /^.*?\/\/.*?\/([\w-]+)\/([\w-]+?)(\.git)?$/;
    const match = url.match(pattern);
    return match?.[2] ?? null;
};