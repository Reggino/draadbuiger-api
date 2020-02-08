// based on https://github.com/131/h264-live-player/blob/master/lib/raspivid.js

import WebSocket, { Server as WebSocketServer } from "ws";
import { Stream, Readable } from "stream";
import { format } from "util";
import { spawn } from "child_process";
import Splitter from "stream-split";

const NALseparator = new Buffer([0, 0, 0, 1]); //NAL break

interface IRaspividStreamerOptions {
  fps: number;
  width: number;
  height: number;
  port: number;
}

export default class RaspividStreamer {
  public options: IRaspividStreamerOptions;
  private wss: WebSocketServer;
  private readStream?: Readable;

  constructor(options: IRaspividStreamerOptions) {
    this.options = options;
    this.wss = new WebSocket.Server({ port: 8080 });
    this.wss.on("connection", this.new_client);
  }

  public start_feed = () => {
    this.readStream = this.get_feed();
    (this.readStream as Stream)
      .pipe(new Splitter(NALseparator))
      .on("data", this.broadcast);
  };

  public get_feed = (): Readable => {
    const msk = "raspivid -t 0 -o - -w %d -h %d -fps %d";
    const cmd = format(
      msk,
      this.options.width,
      this.options.height,
      this.options.fps
    );
    console.log(cmd);
    const streamer = spawn("raspivid", [
      "-t",
      "0",
      "-o",
      "-",
      "-w",
      `${this.options.width}`,
      "-h",
      `${this.options.height}`,
      "-fps",
      `${this.options.fps}`,
      "-pf",
      "baseline"
    ]);
    streamer.on("exit", code => {
      console.log("Failure", code);
    });

    return streamer.stdout;
  };

  public broadcast = (data: Buffer) => {
    this.wss.clients.forEach((socket: WebSocket & { buzy?: boolean }) => {
      if (socket.buzy) return;

      socket.buzy = true;
      socket.buzy = false;

      socket.send(
        Buffer.concat([NALseparator, data]),
        { binary: true },
        (error?: Error) => {
          if (error) {
            console.log(error);
          }
          socket.buzy = false;
        }
      );
    });
  };

  private new_client = (socket: WebSocket) => {
    console.log("New guy");

    socket.send(
      JSON.stringify({
        action: "init",
        width: this.options.width,
        height: this.options.height
      })
    );

    socket.on("message", (data: string) => {
      const [action] = data.split(" ");
      console.log("Incomming action '%s'", action);

      switch (action) {
        case "REQUESTSTREAM":
          this.start_feed();
          break;

        case "STOPSTREAM":
          if (this.readStream) {
            this.readStream.pause();
          }
      }
    });

    socket.on("close", () => {
      if (this.readStream) {
        this.readStream.destroy();
      }
      console.log("stopping client interval");
    });
  };
}
