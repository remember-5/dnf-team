import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";
import { reactive } from "vue";

export const yjsstore = syncedStore(
  reactive({ groupArray: [], heroArray: [] })
);

// Create a document that syncs automatically using Y-WebRTC
const doc = getYjsDoc(yjsstore);

const wsProvider = new WebsocketProvider(
  "ws://192.168.161.80:1234",
  "my-roomname",
  doc
);

wsProvider.on("status", (event) => {
  console.log(event.status); // logs "connected" or "disconnected"
});
export const disconnect = () => wsProvider.disconnect();
export const connect = () => wsProvider.connect();
// Start a y-websocket server, e.g.: HOST=localhost PORT=1234 npx y-websocket-server
