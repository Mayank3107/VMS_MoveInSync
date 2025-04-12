const { createServer } = require("http");
const app = require("../backend/index"); // your express app

module.exports = (req, res) => {
  const server = createServer(app);
  server.emit("request", req, res);
};
