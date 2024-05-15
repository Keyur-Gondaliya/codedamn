import * as Http from "http";
import { Server } from "socket.io";
export function IO(server: Http.Server) {
  return new Server(server, {
    cors: {
      origin: "*",
    },
  });
}
