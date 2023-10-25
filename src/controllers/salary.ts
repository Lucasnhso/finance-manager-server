import { Request, Response } from "express";
import { loadSalary } from "../usecases/salary/load";

export default {
  async find(req: Request, res: Response) {
    try {
      const data = await loadSalary();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  },
};
