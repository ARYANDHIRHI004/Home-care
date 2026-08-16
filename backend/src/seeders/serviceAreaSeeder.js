/**
 * Service Area Seeder
 * Seeds the canonical, deduplicated list of serviceable Bhilai-Durg localities.
 *
 * Usage (from backend directory):
 *   node src/seeders/serviceAreaSeeder.js
 */

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import { env } from "../utils/env.js";
import ServiceArea from "../models/serviceArea.model.js";

// "Rishali" and "Rishali ke sabhi areas" from the source list are the same
// locality stated twice — collapsed into one canonical "Risali" entry with
// both spellings as aliases.
const AREAS = [
  { name: "Sector Areas", city: "Bhilai", matchType: "sector", aliases: [] },
  { name: "Risali", city: "Bhilai", aliases: ["Rishali", "Rishali ke sabhi areas", "Risali Sector"] },
  { name: "Junwani", city: "Bhilai", aliases: ["Junwani Road"] },
  { name: "Kohka", city: "Bhilai", aliases: ["Kohka Road"] },
  { name: "Vaishali Nagar", city: "Bhilai", aliases: ["Vaishali Ngr", "Vaishali Nagar Bhilai"] },
  { name: "Nehru Nagar", city: "Bhilai", aliases: ["Nehru Ngr"] },
  { name: "Smriti Nagar", city: "Bhilai", aliases: ["Smruti Nagar", "Smriti Ngr", "Smruti Ngr"] },
  { name: "Ram Nagar", city: "Bhilai", aliases: ["Ram Ngr"] },
  { name: "Supela", city: "Bhilai", aliases: ["Supela Bhilai"] },
  { name: "Padmanabhpur", city: "Durg", aliases: ["Padmanabhapur", "Padmanabpur", "Padmanabhpur Durg"] },
  { name: "Vidyut Nagar", city: "Bhilai", aliases: ["Vidyut Ngr"] },
  { name: "Ashish Nagar", city: "Bhilai", aliases: ["Ashish Ngr"] },
  { name: "Talpuri", city: "Bhilai", aliases: [] },
  { name: "Ruabandha", city: "Bhilai", aliases: ["Ruabandha Sector"] },
  { name: "Borsi", city: "Durg", aliases: [] },
  { name: "Dhanora", city: "Durg", aliases: [] },
];

async function seedServiceAreas() {
  console.log("🌱 Seeding service areas...");

  try {
    await mongoose.connect(env.MONGO_URI);

    for (const area of AREAS) {
      const result = await ServiceArea.findOneAndUpdate(
        { name: area.name },
        { $set: area },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ ${result.name} (${result.city}${result.matchType === "sector" ? ", pattern" : ""})`);
    }

    console.log(`\n🎉 Seeded ${AREAS.length} service areas.`);
  } catch (error) {
    console.error("❌ Seeder failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedServiceAreas();
