import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    res.status(201).json(await Coupon.create(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    res.json(await Coupon.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
