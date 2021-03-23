/* In node.js we need to create a server of our own not like php where a seperate server which might be connected to our php script
    In this page we will write server related stuffs

*/
/*
        import '' from '' //this type of statement is not supported in node/express
*/


const http = require('http');
const app = require('./app')
/*
    process.env.port access node.js env variables
    most hosting server provides have that, but we don't have that
*/
const port = process.env.PORT || 3000;

const server = http.createServer(app
    );

server.listen(port)