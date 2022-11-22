import { Router } from "express";

export default interface ExpressService {
  register_routes(): Router;
}
