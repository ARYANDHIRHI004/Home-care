// One-off fix: the `phone_1` unique index on the `customers` collection was
// created before `sparse: true` was added to customer.model.js's phone
// field. Mongoose never alters an existing index's options on reconnect —
// only `createIndexes` for indexes that don't exist yet — so the live index
// stayed non-sparse. A non-sparse unique index treats every document
// missing `phone` (every Google-only signup) as having `phone: null`, so
// the moment a second such customer is created, MongoDB rejects it with
// E11000 duplicate key on `{ phone: null }`.
//
// Run once: `node src/migrations/fix-customer-phone-index.js`
// Drops the stale index and lets Mongoose recreate it correctly (sparse)
// via customer.model.js's schema definition on next app connect — or this
// script recreates it directly so you don't have to restart the server.

import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI not set");
  process.exit(1);
}

await mongoose.connect(uri);
const collection = mongoose.connection.db.collection("customers");

const indexes = await collection.indexes();
const phoneIndex = indexes.find((i) => i.key && i.key.phone === 1);

if (!phoneIndex) {
  console.log("No phone_1 index found — nothing to fix.");
} else if (phoneIndex.sparse) {
  console.log("phone_1 index is already sparse — nothing to fix.");
} else {
  console.log(`Dropping non-sparse index '${phoneIndex.name}'...`);
  await collection.dropIndex(phoneIndex.name);
  console.log("Creating sparse unique index on phone...");
  await collection.createIndex({ phone: 1 }, { unique: true, sparse: true });
  console.log("Done.");
}

// Same schema gap could exist on email (also sparse+unique) if it was
// created before that field existed — check and fix it too while we're here.
const emailIndex = indexes.find((i) => i.key && i.key.email === 1);
if (emailIndex && !emailIndex.sparse) {
  console.log(`Dropping non-sparse index '${emailIndex.name}'...`);
  await collection.dropIndex(emailIndex.name);
  console.log("Creating sparse unique index on email...");
  await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
  console.log("Done.");
} else if (emailIndex) {
  console.log("email_1 index is already sparse — nothing to fix.");
}

await mongoose.disconnect();
