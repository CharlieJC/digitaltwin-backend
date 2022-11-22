import { UserController } from "../controller/user-controller";

export const UserRoutes = [
  {
    method: "get",
    route: "",
    controller: UserController,
    action: "all",
    auth: true,
  },
  {
    method: "get",
    route: "/:id",
    controller: UserController,
    action: "one",
    auth: true,
  },
  {
    method: "post",
    route: "",
    controller: UserController,
    action: "save",
    auth: true,
  },
  {
    method: "delete",
    route: "/",
    controller: UserController,
    action: "remove",
    auth: true,
  },
];
