const express = require("express");

const router = express.Router();

const {
    createTask,
    getTasks,
    updateTaskStatus,
    getMyTasks,
    reassignTask,
    deleteTask
} = require("../controllers/taskController");

const { isAuth } = require("../middlewares/isAuth");

router.post(
    "/create-task",
    isAuth,
    createTask
);

router.get(
    "/get-tasks/:projectId",
    isAuth,
    getTasks
);

router.put(
    "/update-task/:id",
    isAuth,
    updateTaskStatus
);

router.get(
    "/my-tasks",
    isAuth,
    getMyTasks
);
router.delete(
    "/:id",
    isAuth,
    deleteTask
);

router.put(
    "/reassign/:id",
    isAuth,
    reassignTask
);

module.exports = router;