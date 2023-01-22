const cors = require("cors");
const corsOptions = cors({
  origin: ["http://localhost:3000"],
  method: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

module.exports = corsOptions;
