import { TwinController } from "../controller/twin-controller";

export const TwinRoutes = [
  {
    method: "get",
    route: "",
    controller: TwinController,
    action: "all",
    auth: true,
  },
  {
    method: "post",
    route: "/allByOwner",
    controller: TwinController,
    action: "allByOwner",
    auth: true,
  },

  {
    method: "post",
    route: "/validCode",
    controller: TwinController,
    action: "validCode",
    auth: false,
  },
  {
    method: "post",
    route: "",
    controller: TwinController,
    action: "save",
    auth: true,
  },
  {
    method: "delete",
    route: "/delete",
    controller: TwinController,
    action: "remove",
    auth: true,
  },
];
