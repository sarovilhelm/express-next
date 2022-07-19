const express = require('express');
const loaders = require('./src/loaders');
const http = require('http');
const {port} = require('./src/config');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

class App {
    static start() {
        this.server = express();
        app.prepare()
            .then(async () => {
                await loaders.init({expressApp: this.server});

                this.server.get('*', (req, res) => {
                    return handle(req, res);
                });

                const server = http.createServer(this.server);

                server.listen(port, () => {
                    console.info(`Listening ${server.address().port} port`);
                });
            })
            .catch((ex) => {
                console.error(ex.stack);
                process.exit(1);
            });
    }
}

App.start();
