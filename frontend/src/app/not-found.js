import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, PhoneCall, ShieldAlert, Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[30rem] h-[30rem] bg-slate-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10">
        
        {/* Animated Visual Badge */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-900 rounded-3xl rotate-6 shadow-xl flex items-center justify-center transition-transform hover:rotate-0 duration-300">
            <Wrench className="w-12 h-12 text-teal-400 -rotate-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border-2 border-white">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>404 ERROR</span>
          </div>
        </div>

        {/* Big Error Heading */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight font-heading">
          Page Not <span className="text-teal-600">Found!</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-md mx-auto font-body">
          Looks like the page you are looking for was moved, renamed, or doesn’t exist in our Bhilai–Durg service network.
        </p>

        {/* Quick Action Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Services</span>
          </Link>
        </div>

        {/* Embedded Emergency Assistance Card */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-luxury max-w-lg mx-auto text-left">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Need immediate home service in Bhilai or Durg?
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-body">
                Don’t let a broken link stop you. Call our office support team directly for immediate assistance.
              </p>
              <a
                href="tel:+919111466642"
                className="inline-block mt-2 text-xs font-bold text-teal-600 hover:text-teal-700 underline"
              >
                +91 91114 66642 (15-Min Callback) →
              </a>
            </div>
          </div>
        </div>

        {/* Footer Brand Credit */}
        <p className="mt-8 text-xs text-slate-400 font-body">
          Home Care Platform • Serving Bhilai, Durg, Risali & Charoda
        </p>

      </div>
    </main>
  );
}