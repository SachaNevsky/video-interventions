### Set up

First, run `npm run setup` to download all the dependencies and setup the environmental variables.

In one console, run `node websocket-server.js` from the driectory root.

In a new console, run `npm run dev`.

### Running locally in two or more windows

Simply go to `http://localhost:3000` in each window after setting up.

### Access from a smartphone

If trying to control from another device, change the following:

1) When you run `node websocket-server.js`, the console will output the IP address on which the server is running
2) On the device, go to `http://{IP_ADDRESS}:3000` to access the webapp
