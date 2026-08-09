import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#F0F4FF] to-white px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          {/* Replace src with your actual logo path, e.g. /logo.png in /public */}
          <img src="/logo2.png" alt="HomeCare" className="h-12 w-12 object-contain" />
          <span
            className="text-xl font-bold text-[#0F172A]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            HomeCare
          </span>
        </div>

        <div className="bg-white border border-[#0F172A]/10 rounded-2xl shadow-xl shadow-[#0F172A]/5 p-8">
          {children}
        </div>

        <p className="text-center text-xs text-[#0F172A]/60 mt-6">
          Need help? <Link href="/contact" className="text-[#2554F0] font-medium hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  );
}
