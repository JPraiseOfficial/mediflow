import { Router } from "express";
import * as controller from "../controllers/users.js";
import { validate } from "../middleware/validate.js";
import {
  createUserSchema,
  updateUserSchema,
  paramsIdSchema,
} from "../schemas/userSchemas.js";

const router = Router();

router.post("/new", validate(createUserSchema), controller.registerUser);
router.get("/", controller.listUsers);
router.get("/:id", validate(paramsIdSchema, "params"), controller.getUser);
router.put(
  "/:id",
  validate(paramsIdSchema, "params"),
  validate(updateUserSchema),
  controller.updateUser
);
router.delete(
  "/:id",
  validate(paramsIdSchema, "params"),
  controller.removeUser
);

export default router;
