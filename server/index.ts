import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import playgroundRoutes from "./routes/playground";
import logger from "morgan";
import connectDB from "./config/mongodb";
import { initSocket } from "./listner/socketWorkspace";
import "./cronJobs";
const server = createServer(app);
initSocket(server);
app.use(cors());
var allowedOrigins = [process.env.APP_URL && process.env.APP_URL.slice(0, -1)];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
connectDB(); //mongo connection
app.use("/api/playground", playgroundRoutes);

app.get("/", async (req, res) => {
  res.json({ message: "Codedamn Lite health Check." }).status(200);
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (!err.isOperational) {
    console.log(err);
  }

  res.status(err.statusCode).json({
    error: err.error,
    status: err.status,
    message: err.message,
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
