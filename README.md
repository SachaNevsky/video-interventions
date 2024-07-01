### Set up

First, run `npm install` to download all the dependencies.

In one console, run `node websocket-server.js` from the driectory root.

In a new console, run `npm run dev`.

### Running locally in two or more windows

Simply go to `http://localhost:3000` in each window after setting up.

### Control from a smartphone

If trying to control from another device, change the following:

1) Run `ipconfig` on hosting device (laptop) and copy the `IPv4 Address`
2) In `./app/layout.js`, change the `WebSocket` ip address to be "`ws://{IPv4Address}:8080`"
3) On the device, go to `http://{IPv4Address}:3000`
