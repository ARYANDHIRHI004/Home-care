'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Map,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Tag,
  Headphones,
  FileText,
  ArrowRight
} from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn
} from 'react-icons/fa6';

const FOOTER_LINKS = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about#story' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  services: [
    { name: 'Cleaning', href: '/services#cleaning' },
    { name: 'Electrical', href: '/services#electrical' },
    { name: 'Plumbing', href: '/services#plumbing' },
    { name: 'Painting', href: '/services#painting' },
    { name: 'Carpentry', href: '/services#carpentry' },
    { name: 'Appliance Repair', href: '/services#appliance' },
    { name: 'Pest Control', href: '/services#pest-control' },
    { name: 'Water Tank Cleaning', href: '/services#water-tank' },
  ],
  support: [
    { name: 'Help Center', href: '/faq' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'Cancellation Policy', href: '/cancellation-policy' },
    { name: 'Refund Policy', href: '/refund-policy' },
  ]
};

const TRUST_BADGES = [
  { icon: FileText, label: 'GST Registered' },
  { icon: CheckCircle2, label: 'Verified Professionals' },
  { icon: Lock, label: 'Secure Payments' },
  { icon: Tag, label: 'Transparent Pricing' },
  { icon: Headphones, label: 'Customer Support' },
  { icon: FileText, label: 'Invoice Available' },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaWhatsapp, href: '#', label: 'WhatsApp' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-24 pb-8 border-t border-slate-900 font-sans text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP SECTION: Trust & Newsletter in a Rounded Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="bg-slate-900/50 rounded-3xl p-8 lg:p-12 mb-16 flex flex-col lg:flex-row gap-12 items-center justify-between border border-slate-800 backdrop-blur-sm"
        >
          {/* Trust Badges */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold text-white mb-6">Why Choose Us</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {TRUST_BADGES.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <div className="p-2 bg-slate-800 rounded-full text-blue-400 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <badge.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-1/2 lg:pl-12 lg:border-l border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-2">Subscribe to our Newsletter</h3>
            <p className="text-sm text-slate-400 mb-6">Stay updated with our latest offers, home maintenance tips, and new services.</p>
            <form className="flex gap-2 relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors flex items-center gap-2 group-hover:pr-5 duration-300"
              >
                Subscribe <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* MIDDLE SECTION: Main Links */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16"
        >
          {/* Company */}
          <motion.div variants={fadeIn}>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-500 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeIn}>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Services</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-500 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={fadeIn}>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-500 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeIn} className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed text-slate-400">
                  123 HomeCare Tower, Business Bay,<br />
                  New Delhi, 110001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="mailto:support@homecare.com" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">support@homecare.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm text-slate-400">Mon - Sun: 8:00 AM - 9:00 PM</span>
              </li>
            </ul>

            <a href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 bg-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-900/50 hover:text-white transition-colors group">
              <Map className="w-4 h-4" />
              View on Google Maps
            </a>

            <div className="w-[300px]  py-5 rounded-3xl  overflow-hidden  shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29766.699848793447!2d81.334907!3d21.158865000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a293df4a5c71ba7%3A0xd9e0fe00239aec95!2sDesign%20Consultant!5e0!3m2!1sen!2sin!4v1786262402656!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                className='rounded-xl'
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Google Map - Design Consultant"
              />
            </div>

          </motion.div>
        </motion.div>

        {/* BOTTOM SECTION: Social & Legal */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="text-sm text-center md:text-left text-slate-400">
            <p>&copy; {new Date().getFullYear()} HomeCare Platform. Designed with <span className="text-red-500 animate-pulse inline-block">❤️</span></p>
            <p className="mt-1">All Rights Reserved.</p>
          </div>

          <div className="flex gap-4 text-sm font-medium text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
