/*
        import '' from '' //this type of statement is not supported in node/express
*/
const http = require('http'); 
const app = require('./app'); 
/*
    process.env.port access node.js env variables
    most hosting server provides have that, but we don't have that
*/
const port =  process.env.PORT || 8080

const server = http.createServer(app);

server.listen(port)