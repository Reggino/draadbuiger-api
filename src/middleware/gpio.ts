import { Request, Response } from "express";
import { Gpio } from "onoff";

export function readMiddleware(req: Request, res: Response) {
  const pin = new Gpio(parseInt(req.params.pin, 10), "in"); //put
  res.json(pin.readSync());
}

export function writeMiddleware(req: Request, res: Response) {
  const pin = new Gpio(parseInt(req.params.pin, 10), "out"); //put
  res.json(pin.writeSync(req.query.high ? 1 : 0));
  res.end();
}
