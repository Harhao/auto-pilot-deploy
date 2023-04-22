import { ServerConfig } from "../config";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";

enum ESocketMsgType {
    ALLCHANEL = "allChannel",
    SINGLECHANNEL = "singleChannel",
}

export default class SocketService {

    private readonly io: SocketServer;
    private socketId: string | string[];
    private httpServer: Server;

    constructor(appCallback: any) {

        this.httpServer = new Server(appCallback);
        this.io = new SocketServer(this.httpServer, {
            cors: ServerConfig.serverCors
        });
        this.io.on("connection", (socket) => {
            console.log(`socketIO connect by ${socket.id}`);
            this.socketId = socket.id;
            socket.on("disconnect", () => {
                this.removeSocketId();
            });
        });
    }
    
    public getSocketServer() {
        return this.httpServer;
    }

    public sendToAll(data: string): void {
        this.io.emit(ESocketMsgType.ALLCHANEL, data);
    }

    public sendToSocketId(data: string) {
        this.io.to(this.socketId).emit( ESocketMsgType.SINGLECHANNEL, data);
    }

    public removeSocketId() {
        this.socketId = null;
    }

    public close() {
        this.io.close();
    }
}
