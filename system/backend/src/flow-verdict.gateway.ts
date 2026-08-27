import { Logger, type OnModuleInit } from '@nestjs/common';
import {
  type OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

import { CorrelationService } from './correlation.service';
import { CORS_ORIGIN, FLOW_VERDICT_EVENT } from './config';

/**
 * The websocket to the browser. It only relays (code-standards.md Section 4): it
 * subscribes the correlator's output and pushes each merged flow+verdict row to every
 * connected client. No business logic lives here.
 */
@WebSocketGateway({ cors: { origin: CORS_ORIGIN } })
export class FlowVerdictGateway implements OnModuleInit, OnGatewayConnection {
  private readonly log = new Logger('FlowVerdictGateway');

  @WebSocketServer()
  private server!: Server;

  constructor(private readonly correlation: CorrelationService) {}

  onModuleInit(): void {
    this.correlation.merged$.subscribe((row) => this.server.emit(FLOW_VERDICT_EVENT, row));
  }

  handleConnection(client: Socket): void {
    this.log.log(`client connected: ${client.id}`);
  }
}
