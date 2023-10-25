import express from "express";
import cors from "cors";
import "dotenv/config";
import { extractSalary } from "./usecases/salary/extract";
import "./jobs";
const port = process.env.PORT || 3333;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "OK",
  });
});

app.listen(port, async () => {
  console.log("Aplicação executando na porta", port);
  await extractSalary();
  // await extractSalary();
});
