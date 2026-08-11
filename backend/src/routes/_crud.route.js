import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

export const createCrudRouter = ({
  controller,
  resource,
  includeDelete = true,
}) => {
  const router = Router();

  const create = controller[`create${resource}`] || controller.create;
  const list = controller[`get${resource}s`] || controller.getAll || controller.get;
  const getOne = controller[`get${resource}ById`] || controller.getById;
  const update = controller[`update${resource}`] || controller.update;
  const remove = controller[`delete${resource}`] || controller.remove;

  router.use(requireAuth);

  if (create) {
    router.post("/", requirePermission(`${resource.toLowerCase()}:create`), create);
  }
  if (list) {
    router.get("/", requirePermission(`${resource.toLowerCase()}:read`), list);
  }
  if (getOne) {
    router.get("/:id", requirePermission(`${resource.toLowerCase()}:read`), getOne);
  }
  if (update) {
    router.patch("/:id", requirePermission(`${resource.toLowerCase()}:update`), update);
  }
  if (includeDelete && remove) {
    router.delete("/:id", requirePermission(`${resource.toLowerCase()}:delete`), remove);
  }

  return router;
};
