const Project = require("../models/projectModel");
const Task = require("../models/taskModel");


const createProject = async (req, res) => {

    try {

        const {
            projectName,
            description,
            deadline,
            members
        } = req.body;

        if (!projectName || !description || !deadline) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newProject = await Project.create({
            projectName,
            description,
            deadline,
            members,
            createdBy: req.userId
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project: newProject
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ---------------- GET ALL PROJECTS ---------------- */
const getProjects = async (req, res) => {

    try {

        const projects = await Project.find()
            .populate("createdBy", "fullName email")
            .populate("members", "fullName email role");

        return res.status(200).json({
            success: true,
            projects
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ---------------- GET SINGLE PROJECT ---------------- */
const getSingleProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id)
            .populate("createdBy", "fullName email")
            .populate("members", "fullName email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            project
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ---------------- UPDATE PROJECT ---------------- */
const updateProject = async (req, res) => {

    try {

        const {
            projectName,
            description,
            deadline,
            status,
            members
        } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                projectName,
                description,
                deadline,
                status,
                members
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project: updatedProject
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ---------------- DELETE PROJECT (NEW) ---------------- */
const deleteProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // 🔐 Only owner or admin can delete
        if (
            project.createdBy.toString() !== req.userId &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this project"
            });
        }

        // 🗑️ Delete all tasks under this project
        await Task.deleteMany({ projectId: project._id });

        // 🗑️ Delete project
        await Project.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Project and all related tasks deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createProject,
    getProjects,
    getSingleProject,
    updateProject,
    deleteProject
};