import http from "http";
import express, { Request, Response } from "express";
import RaspividStreamer from "./inc/raspividStreamer";

const app = express();
const server = http.createServer(app);

const raspividStreamer = new RaspividStreamer({
  fps: 12,
  width: 960,
  height: 540,
  port: 8080
});

app.get("/", (req: Request, res: Response) => {
  res.json({ hello: "world" });
});

server.listen(80, () => {
  console.log("Draadbuiger API listening on port", 80);
  console.log("Raspivid streamer configured as ", raspividStreamer.options);
});
