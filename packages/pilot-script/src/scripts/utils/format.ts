export function formatPmJSON(list: any[]) {
    return list.map(item => {
        return {
            pid: item.pid,
            name: item.name,
            created_at: item?.pm2_env.created_at,
            status: item?.pm2_env.status,
            USER: item?.pm2_env.USER,
            pm_id: item?.pm2_env.pm_id,
            monit: item?.monit,
            pm_cwd: item?.pm2_env.pm_cwd,
            node_version: item?.pm2_env.node_version,
            pm_uptime: item?.pm2_env.pm_uptime,
            unique_id: item?.pm2_env.unique_id
        };
    });
}