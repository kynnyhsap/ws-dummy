Bun.serve({
  websocket: {
    message(ws, message) {
      console.log("message recieved", message);
    },

    open(ws) {
      console.log("connection opened");

      fetch("http://stream.live.vc.bbcmedia.co.uk/bbc_world_service").then(
        async (resp) => {
          const stream = resp.body;

          if (!stream) {
            return;
          }

          for await (const chunk of stream) {
            ws.send(chunk);
          }
        }
      );
    },

    close(ws, code, message) {
      console.log("connection closed");
    },

    drain(ws) {
      // the socket is ready to receive more data
      console.log("drain");
    },
  },

  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
});
