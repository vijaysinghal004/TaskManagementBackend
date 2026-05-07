const express = require("express");

const router = express.Router();

const {
    createProject,
    getProjects,
    getSingleProject,
    updateProject
} = require("../controllers/projectController");

const { isAuth } = require("../middlewares/isAuth");
const { deleteProject } = require("../controllers/projectController");

router.post(
    "/create-project",
    isAuth,
    createProject
);

router.get(
    "/get-projects",
    isAuth,
    getProjects
);

router.get(
    "/get-project/:id",
    isAuth,
    getSingleProject
);

router.put(
    "/update-project/:id",
    isAuth,
    updateProject
);
router.delete(
    "/delete-project/:id",
    isAuth,
    deleteProject
);

module.exports = router;