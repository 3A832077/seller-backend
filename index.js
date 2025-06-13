// api/index.js
import jsonServer from 'json-server';
import path from 'path';

// 建立 JSON Server
const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), 'db.json')); // 注意這裡
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

// 匯出符合 Vercel serverless function 規範的 handler
export default server;
