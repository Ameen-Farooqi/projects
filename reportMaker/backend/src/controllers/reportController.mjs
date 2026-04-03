import reportModel from "../models/reportModel.mjs";
const createReport = async (req, res) => {
    try {
        const { taskTitle, adminInstructions, propertyType, address, assignedTo } = req.body;
        const { userId } = req.user;
        if (!assignedTo) {
            return res.status(400).send({ message: "assignedTo is required" });
        }
        const report = await reportModel.create({
            userId,
            taskTitle: (taskTitle && String(taskTitle).trim()) || "Untitled task",
            adminInstructions: adminInstructions != null ? String(adminInstructions).trim() : "",
            propertyType: propertyType || "other",
            address: (address && String(address).trim()) || "To be confirmed on site",
            description: "",
            images: [],
            assignedTo,
        });
        return res.status(201).send({ message: "Report task created successfully", report });
    } catch (error) {
        if (error.message.includes("validation")) {
            return res.status(400).send({ message: "Validation failed", error: error.message });
        } else {
            return res.status(500).send({ message: "Internal server error" });
        }
    }
};
const getReports = async (req, res) => {
    try {
        let role = req.user.role;
        let reports = null;
        if (role === 'admin') {
            reports = await reportModel.find();
        } else {
            reports = await reportModel.find({ assignedTo: role });
        }
        return res.status(200).send({ message: "Reports found", reports });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
};
const getMyCreatedReports = async (req, res) => {
    try {
        const { userId } = req.user;
        const reports = await reportModel.find({ userId }).sort({ updatedAt: -1 });
        return res.status(200).send({ message: "Reports found", reports });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
};
const updateReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { propertyType, address, description, images } = req.body;
        const existing = await reportModel.findById(reportId);
        if (!existing) {
            return res.status(400).send({ message: "Report not found" });
        }
        const role = req.user.role;
        const canEdit =
            role === "admin" || existing.assignedTo === role;
        if (!canEdit) {
            return res.status(403).send({ message: "You can only update reports assigned to your role" });
        }
        let imageList = existing.images;
        if (images !== undefined) {
            imageList = Array.isArray(images)
                ? images.map((u) => String(u).trim()).filter(Boolean)
                : [];
        }
        const report = await reportModel.findByIdAndUpdate(
            reportId,
            {
                propertyType,
                address,
                description,
                images: imageList,
                updated: true,
                updatedBy: req.user.userId,
            },
            { new: true }
        );
        return res.status(200).send({ message: "Report updated successfully", report });
    } catch (error) {
        if (error.message.includes("report not found")) {
            return res.status(400).send({ message: "Report not found" });
        } else if (error.message.includes("validation")) {
            return res.status(400).send({ message: "Validation failed", error: error.message });
        } else {
            return res.status(500).send({ message: "Internal server error" });
        }
    }
};
export { createReport, getReports, getMyCreatedReports, updateReport };