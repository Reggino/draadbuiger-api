import http from "http";
import express, { Request, Response } from "express";

const app = express();
const server = http.createServer(app);

app.get("/", (req: Request, res: Response) => {
  res.json({ hello: "world" });
});
app.get("/image", (req: Request, res: Response) => {
  res.sendFile("/dev/shm/mjpeg/cam.jpg");
});

server.listen(80, () => {
  console.log("Draadbuiger API listening on port", 80);
  // console.log("Raspivid streamer configured as ", raspividStreamer.options);
});
