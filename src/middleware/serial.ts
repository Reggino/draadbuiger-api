import { NextFunction, Request, Response } from "express";
import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";
import MockBinding from "@serialport/binding-mock";

// CONFIG //

const ENABLE_MOCK_RESPONSE = true;

// END OF CONFIG //

if (ENABLE_MOCK_RESPONSE) {
  SerialPort.Binding = MockBinding;
  MockBinding.createPort("/dev/ttyACM0", { record: true });
}

const port = new SerialPort("/dev/ttyACM0", { baudRate: 115200 });

function waitForIdle() {
  return new Promise(resolve => {
    const parser = new Readline();
    port.pipe(parser);
    parser.on("data", (line: string) => {
      console.log(`> ${line}`);
      if (line.indexOf("Idle") >= 0) {
        clearInterval(interval);
        port.unpipe(parser);
        parser.destroy();
        resolve();
      }
    });
    const interval = setInterval(() => {
      port.write("?");
      if (ENABLE_MOCK_RESPONSE) {
        (port.binding as any).emitData("Idle\n");
      }
    }, 100);
  });
}

let isIdle = true;

export default (req: Request, res: Response, next: NextFunction) => {
  if (!isIdle) {
    throw new Error("Serial port is busy. Please wait");
  }
  isIdle = false;
  port.write(req.query.command);
  waitForIdle()
    .then(() => {
      isIdle = true;
      res.end();
    })
    .catch(next);
};
