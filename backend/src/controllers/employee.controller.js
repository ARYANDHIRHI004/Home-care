<<<<<<< HEAD
import bcrypt from "bcrypt";
import Employee from "../models/employee.model.js";
=======
import bcrypt from "bcryptjs";
import {Employee} from "../models/employee.models.js";
>>>>>>> 5ac41fc5309cd9b147f688222bba01fcd61f1c9a

export const createEmployee = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });

    const passwordHash = await bcrypt.hash(password, 12);
    const employee = await Employee.create({ ...data, passwordHash });

    const safeEmployee = employee.toObject();
    delete safeEmployee.passwordHash;
    res.status(201).json(safeEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.active !== undefined) filter.active = req.query.active === "true";

    res.json(
      await Employee.find(filter).select("-passwordHash").sort({ createdAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-passwordHash");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 12);
      delete data.password;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id, data, { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePermissions = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { permissions: req.body.permissions || [] },
      { new: true }
    ).select("-passwordHash");

    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
