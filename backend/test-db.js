import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faq from './src/models/faq.model.js';
import dns from 'dns';
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

async function test() {
  console.log("Connecting to:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  
  const faqs = await Faq.find({});
  console.log("FAQs in DB:", faqs.length, faqs);
  
  console.log("Collection name:", Faq.collection.name);
  
  await mongoose.disconnect();
}

test().catch(console.error);
