import express, { Request, Response } from "express";
import nocache from "nocache";
import cors from "cors";
import { absolutePath } from "swagger-ui-dist";
import mjpegMiddleware from "./middleware/image.mjpeg";
import { readMiddleware, writeMiddleware } from "./middleware/gpio";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.static(absolutePath()));
app.use(nocache());
app.get("/image.jpg", (req: Request, res: Response) => {
  res.sendFile("/dev/shm/mjpeg/cam.jpg");
});
app.get("/image.mjpeg", mjpegMiddleware);
app.get("/gpio/:pin", readMiddleware);
app.post("/gpio/:pin", writeMiddleware);
app.use(errorHandler);

app.listen(80, () => {
  console.log("Draadbuiger API listening on port", 80);
});
