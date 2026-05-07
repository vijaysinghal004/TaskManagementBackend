const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    deadline: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "inprogress", "completed"],
        default: "pending"
    },

    totalTasks: {
        type: Number,
        default: 0
    },

    completedTasks: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, {
    timestamps: true
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;