import { ObjectId } from "mongodb";
import { db } from "../../utils/auth.js";
import { HEARD_FROM_VALUES } from "../../enum/heard-from.enum.js";

// additionalFields are declared with `input: false`, so Better Auth's own
// update-user endpoint won't accept them — writing straight to the `user`
// collection (modelName "user", keyed by _id as an ObjectId) is the same
// pattern app.js's dev-seed-admin route already uses to set `role`.
export const updateCustomerProfile = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "This endpoint is for customer accounts only" });
    }

    const { address, heardFrom, name } = req.body;

    // All optional per-call — registration seeds just the address, the
    // onboarding modal later fills in just heardFrom, and the Profile
    // page's rename action sends just name.
    if (address === undefined && heardFrom === undefined && name === undefined) {
      return res.status(400).json({ message: "Provide address, heardFrom, and/or name" });
    }

    const $set = { updatedAt: new Date() };

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "name cannot be empty" });
      }
      $set.name = name.trim();
    }

    if (address !== undefined) {
      if (!address?.line?.trim() || !address?.city?.trim()) {
        return res.status(400).json({ message: "address.line and address.city are required" });
      }
      $set.address = {
        line: address.line.trim(),
        city: address.city.trim(),
        landmark: address.landmark?.trim() || "",
        // The locality the customer selected from the serviceable-areas
        // dropdown — optional here, since a profile address is saved even
        // outside the service area (only checkout hard-blocks on this).
        locality: address.locality?.trim() || "",
        lat: typeof address.lat === "number" ? address.lat : null,
        lng: typeof address.lng === "number" ? address.lng : null,
      };
    }

    if (heardFrom !== undefined) {
      if (!HEARD_FROM_VALUES.includes(heardFrom)) {
        return res.status(400).json({
          message: `heardFrom must be one of: ${HEARD_FROM_VALUES.join(", ")}`,
        });
      }
      $set.heardFrom = heardFrom;
    }

    // Always derived from the session, never from the request body — a
    // customer can only ever complete their own profile.
    const existing = await db.collection("user").findOne({ _id: new ObjectId(req.user.id) });
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    const willHaveAddress = $set.address ?? existing.address;
    const willHaveHeardFrom = $set.heardFrom ?? existing.heardFrom;
    if (willHaveAddress && willHaveHeardFrom && !existing.profileCompletedAt) {
      $set.profileCompletedAt = new Date();
    }

    const result = await db.collection("user").findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $set },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const { ...user } = result;
    user.id = user._id.toString();
    delete user._id;

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
