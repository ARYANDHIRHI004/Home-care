import WorkOrder from "../models/work-order.model.js";
import Enquiry from "../models/enquiry.model.js";

const generateWorkOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `WO-${year}-${random}`;
};

export const createWorkOrder = async (req, res) => {
  try {
    const { enquiryId, customerId, byEmployeeId } = req.body;

    if (!enquiryId || !customerId)
      return res.status(400).json({ message: "enquiryId and customerId are required" });

    const workOrder = await WorkOrder.create({
      ...req.body,
      workOrderNumber: req.body.workOrderNumber || generateWorkOrderNumber(),
      status: "open",
      timeline: [{ status: "open", timestamp: new Date(), byEmployeeId }],
    });

    await Enquiry.findByIdAndUpdate(enquiryId, { status: "converted" });
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWorkOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedPartnerId) filter.assignedPartnerId = req.query.assignedPartnerId;
    if (req.query.customerId) filter.customerId = req.query.customerId;

    const workOrders = await WorkOrder.find(filter)
      .populate("customerId", "name phone email")
      .populate("assignedPartnerId", "name phone skills")
      .sort({ createdAt: -1 });

    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate("customerId")
      .populate("enquiryId")
      .populate("assignedPartnerId");

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWorkOrderStatus = async (req, res) => {
  try {
    const { status, byEmployeeId } = req.body;
    if (!status) return res.status(400).json({ message: "status is required" });

    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { timeline: { status, timestamp: new Date(), byEmployeeId } },
      },
      { new: true }
    );

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignPartner = async (req, res) => {
  try {
    const { assignedPartnerId, byEmployeeId } = req.body;

    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      {
        assignedPartnerId,
        status: "assigned",
        $push: {
          timeline: { status: "assigned", timestamp: new Date(), byEmployeeId },
        },
      },
      { new: true }
    );

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addWorkOrderNote = async (req, res) => {
  try {
    const { text, employeeId } = req.body;
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      { $push: { internalNotes: { text, employeeId, timestamp: new Date() } } },
      { new: true }
    );

    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findByIdAndDelete(req.params.id);
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });
    res.json({ message: "Work order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
