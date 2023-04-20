// index.ts
import App from "./app";

try {
    const app = new App();
    app.start();
} catch (e) {
    console.error("服务启动失败", e);
}
