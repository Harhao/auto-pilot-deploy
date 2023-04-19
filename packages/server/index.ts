// index.ts
import App from "./app";
import { ServerConfig } from "./config";

try {
    const config = {
        port: ServerConfig.port,
        corsOptions: {
            origin: "*",
        },
    };
    const app = new App(config);
    app.start();
} catch (e) {
    console.error("服务启动失败", e);
}
