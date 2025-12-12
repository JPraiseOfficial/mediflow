import express from "express";
import usersRouter from "./routes/users.js";
import globalErrorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);

app.use(globalErrorHandler);

export default app;
