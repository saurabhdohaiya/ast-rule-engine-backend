import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import ruleRoutes from "./routes/rouleRoutes";
import cors from 'cors';

dotenv.config();

connectDB();

const app: Application = express();


app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send({ 
    status : "OK", 
    message: "Server is healthy!"
  });
});

app.use("/api/rules", ruleRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
