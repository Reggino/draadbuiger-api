import { Request, Response } from "express";
import { createReadStream } from "fs";

// CONFIG
// max 50 fps
const MAX_FPS = 25;

// APP
const minMsPerFrame = 1000 / MAX_FPS;

export default (req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "multipart/x-mixed-replace; boundary=myboundary",
    "Cache-Control": "no-cache",
    Connection: "close",
    Pragma: "no-cache"
  });

  let requestClosed = false;
  let lastFrameTime = 0;
  let fps = 0;
  const fpsInterval = setInterval(() => {
    console.log("Camera fps", fps / 10);
    fps = 0;
  }, 10000);

  req.on("close", () => {
    if (fpsInterval) {
      clearInterval(fpsInterval);
    }
    requestClosed = true;
  });

  const serveImage = () => {
    lastFrameTime = new Date().getTime();
    fps++;
    res.write("--myboundary\r\n");
    res.write("Content-Type: image/jpeg\r\n");
    res.write("\r\n");
    const jpegStream = createReadStream("/dev/shm/mjpeg/cam.jpg");
    jpegStream.on("end", data => {
      res.write("\r\n");
      if (requestClosed) {
        res.end();
        return;
      }
      const lastFrameDelta = new Date().getTime() - lastFrameTime;
      // limit to 50 fps
      if (lastFrameDelta >= minMsPerFrame) {
        serveImage();
        return;
      }

      setTimeout(serveImage, minMsPerFrame - lastFrameDelta);
    });
    jpegStream.pipe(res, { end: false });
  };

  serveImage();
};
