import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ hello: "world" });
});

app.listen(80, () => {
  console.log("Draadbuiger API listening on port ", 80);
});
