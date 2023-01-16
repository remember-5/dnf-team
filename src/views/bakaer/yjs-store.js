import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";
import { reactive } from "vue";

export const yjsstore = syncedStore(
  // 数据格式必须是空值，不允许有默认值
  reactive({ groupArray: [], heroArray: [] })
);

// Create a document that syncs automatically using Y-WebRTC
const doc = getYjsDoc(yjsstore);

// roomname use uuid
let wsProvider;

export const initWebSocket = (guid) => {
  wsProvider = new WebsocketProvider(
    import.meta.env.VITE_WEB_SOCKET_URL,
    guid,
    doc
  );

  wsProvider.on("status", (event) => {
    console.log(event.status); // logs "connected" or "disconnected"
  });
};

export const disconnect = () => wsProvider.disconnect();
export const connect = () => wsProvider.connect();
// Start a y-websocket server, e.g.: HOST=localhost PORT=1234 npx y-websocket-server
