import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class IotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`[IotGateway] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[IotGateway] Client disconnected: ${client.id}`);
  }

  // Broadcaster function - safe to call even before server is ready
  broadcastIotUpdate(userId: string, data: any) {
    try {
      if (this.server) {
        this.server.emit(`iot_update_${userId}`, data);
      }
    } catch (e) {
      console.warn('[IotGateway] Server not ready yet, skipping broadcast:', e);
    }
  }
}
