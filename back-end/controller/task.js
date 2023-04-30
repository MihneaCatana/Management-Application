const TaskDb = require("../models").Task;
const UserDb = require("../models").User;

const controller = {
  getAllTasks: async (req, res) => {
    await TaskDb.findAll()
      .then((tasks) => {
        res.status(200).send(tasks);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ message: "Server error!" });
      });
  },

  getTaskById: async (req, res) => {
    try {
      const task = await TaskDb.findOne({
        where: { id: req.params.id },
      });

      if (task) {
        res.status(200).send(task);
      } else {
        res.status(404).send({ message: "Task not found!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server error!" });
    }
  },

  createTask: async (req, res) => {
    try {
      const task = await TaskDb.create({
        name: req.body.name,
        description: req.body.description,
      });
      res.status(200).send(task);
    } catch (error) {
      res.status(500).send({ message: "Server error!" });
    }
  },

  updateTaskById: async (req, res) => {
    try {
      const task = await TaskDb.findOne({
        where: { id: req.params.id },
      });

      if (task) {
        if (req.body.name) {
          task.name = req.body.name;
        }

        if (req.body.description) {
          task.description = req.body.description;
        }

        if (req.body.idStatusTask) {
          task.idStatusTask = req.body.idStatusTask;
        }

        if (req.body.deadline) {
          task.deadline = req.body.deadline;
        }

        if (req.body.finishedTime) {
          task.finishedTime = req.body.finishedTime;
        }

        if (req.body.idUser) {
          task.idUser = req.body.idUser;
        }

        await task.save();

        res.status(200).send(task);
      } else {
        res.status(404).send({ message: "Task not found!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server error!" });
    }
  },

  assignTask: async (req, res) => {
    try {
      const task = TaskDb.findOne({
        where: { id: req.params.idTask },
      });

      const user = UserDb.findOne({
        where: { id: req.params.idUser },
      });

      if (task) {
        if (user && user.idStatus == 1) {
          task.idUser = req.params.idUser;
          task.idStatusTask = 2;
          task.deadline = req.body.deadline;

          await task.save();
        } else {
          res.status(404).send({ message: "User doesn't exist!" });
        }
      } else {
        res.status(404).send({ message: "Task doesn't exist!" });
        return;
      }
    } catch (error) {}
  },

  deleteTask: async (req, res) => {
    const task = await TaskDb.findOne({
      where: { id: req.params.id },
    });

    if (task) {
      await task.destroy();
      res.status(200).send({
        message: `Department with id ${req.params.id} was destroyed! `,
      });
    } else {
      res.status(404).send({ message: " Task was not found ! " });
    }
  },
};

module.exports = controller;
