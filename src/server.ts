import express from "express";
import cors from "cors";
import "dotenv/config";
import "./jobs";
import routes from "./routes";
const port = process.env.PORT || 3333;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(port, async () => {
  console.log("Aplicação executando na porta", port);
});
