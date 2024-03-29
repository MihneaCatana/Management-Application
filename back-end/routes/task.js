const express = require("express");
const router = express.Router();
const TaskController = require("../controller").task;

router.post("/create", TaskController.createTask);

router.get("/", TaskController.getAllTasks);

router.get("/:id", TaskController.getTaskById);

router.get("/department/:idDepartment", TaskController.getTaskByIdDepartment)

router.get("/project/:idProject", TaskController.getTaskByIdProject)

router.get("/user/:idUser", TaskController.getTaskByIdUser);

router.put("/:id", TaskController.updateTaskById);

router.put("/assign/:id", TaskController.assignTask);

router.delete("/:id", TaskController.deleteTask);

module.exports = router;
