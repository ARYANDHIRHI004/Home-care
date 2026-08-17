import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faq from './src/models/faq.model.js';
import dns from 'dns';
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const faq = await Faq.create({
    question: "Test backend connection FAQ",
    answer: "This is a test to verify database connection.",
    category: "General",
    active: true,
    order: 1
  });
  
  console.log("FAQ created:", faq._id);
  
  await mongoose.disconnect();
}

seed().catch(console.error);
