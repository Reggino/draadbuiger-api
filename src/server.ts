import express, { Request, Response } from "express";
import nocache from "nocache";
import cors from "cors";
import { absolutePath } from "swagger-ui-dist";
import mjpegMiddleare from "./middleware/image.mjpeg";

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.static(absolutePath()));
app.use(nocache());
app.get("/image.jpg", (req: Request, res: Response) => {
  res.sendFile("/dev/shm/mjpeg/cam.jpg");
});
app.get("/image.mjpeg", mjpegMiddleare);

app.listen(80, () => {
  console.log("Draadbuiger API listening on port", 80);
});
