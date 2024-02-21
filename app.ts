import * as express from "express";
import { myDataSource } from "./app-data-source";
import mainRoute from "./src/routes/AppRoute";
require("dotenv").config();
import { errorHandler } from "./src/midleware/errorHandler";
const cors = require("cors");
const port = process.env.PORT

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(errorHandler);
app.use("/", mainRoute);

app.listen(port);
