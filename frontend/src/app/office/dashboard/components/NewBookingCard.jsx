import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';

export default function NewBookingCard() {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30 flex flex-col justify-between h-full relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">New Booking</h3>
                <p className="text-blue-100 text-sm mb-6 max-w-[200px]">
                    Quickly create a new service booking for a customer.
                </p>
            </div>

            <Link
                href="/office/bookings"
                className="relative z-10 inline-flex items-center justify-between w-full bg-white text-blue-700 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors group"
            >
                Create Booking
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
