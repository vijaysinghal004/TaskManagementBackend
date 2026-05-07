const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

/* -------------------- CREATE TASK -------------------- */
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            deadline,
            assignedTo,
            projectId
        } = req.body;

        if (!title || !description || !deadline || !assignedTo || !projectId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const newTask = await Task.create({
            title,
            description,
            priority,
            deadline,
            assignedTo,
            projectId,
            createdBy: req.userId
        });

        project.totalTasks += 1;
        await project.save();

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* -------------------- GET TASKS BY PROJECT -------------------- */
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            projectId: req.params.projectId
        })
            .populate("assignedTo", "fullName email")
            .populate("createdBy", "fullName email");

        return res.status(200).json({
            success: true,
            tasks
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* -------------------- UPDATE TASK STATUS -------------------- */
const updateTaskStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatus = ["todo", "inprogress", "completed"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // 🔐 SECURITY CHECK
        if (
            task.assignedTo.toString() !== req.userId &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this task"
            });
        }

        const oldStatus = task.status;

        task.status = status;
        await task.save();

        // 📊 Update project progress efficiently
        const project = await Project.findById(task.projectId);

        if (oldStatus !== status) {

            const completedTasks = await Task.countDocuments({
                projectId: task.projectId,
                status: "completed"
            });

            project.completedTasks = completedTasks;

            await project.save();
        }

        return res.status(200).json({
            success: true,
            message: "Task status updated",
            task
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* -------------------- GET MY TASKS -------------------- */
const getMyTasks = async (req, res) => {
    try {

        const tasks = await Task.find({
            assignedTo: req.userId
        })
            .populate("projectId", "projectName")
            .populate("createdBy", "fullName");

        return res.status(200).json({
            success: true,
            tasks
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const deleteTask = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // 🔐 only admin or creator can delete
        if (
            task.createdBy.toString() !== req.userId &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this task"
            });
        }

        const project = await Project.findById(task.projectId);

        await task.deleteOne();

        // update project task count
        project.totalTasks -= 1;

        if (task.status === "completed") {
            project.completedTasks -= 1;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const reassignTask = async (req, res) => {
    try {

        const { assignedTo } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // 🔐 only admin or task creator can reassign
        if (
            task.createdBy.toString() !== req.userId &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to reassign this task"
            });
        }

        if (!assignedTo) {
            return res.status(400).json({
                success: false,
                message: "Assigned user is required"
            });
        }

        task.assignedTo = assignedTo;

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task reassigned successfully",
            task
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// module.exports = {
//     createTask,
//     getTasks,
//     updateTaskStatus,
//     getMyTasks
// };
module.exports = {
    createTask,
    getTasks,
    updateTaskStatus,
    getMyTasks,
    deleteTask,
    reassignTask
};