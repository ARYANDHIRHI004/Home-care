'use client';

import {
    BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    dailyBookingData, bookingByCategoryData,
    bookingStatusData, bookingBySourceData, partnerWorkloadData
} from '../data/bookingData';

const RADIAN = Math.PI / 180;
const renderPctLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    return (
        <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)}
            fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function ChartCard({ title, subtitle, children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden ${className}`}>
            <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

export function DailyBookingTrendChart() {
    return (
        <ChartCard title="Daily Booking Trend" subtitle="Bookings, completions and cancellations by day of week">
            <ResponsiveContainer width="100%" height={230}>
                <LineChart data={dailyBookingData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="bookings" name="Total" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
                    <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#f87171" strokeWidth={1.5} dot={{ r: 3, fill: '#f87171', strokeWidth: 0 }} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function BookingByCategoryChart() {
    return (
        <ChartCard title="Bookings by Service Category" subtitle="Volume distribution across service types">
            <div className="flex items-center gap-5">
                <ResponsiveContainer width="50%" height={210}>
                    <PieChart>
                        <Pie data={bookingByCategoryData} cx="50%" cy="50%" outerRadius={88}
                            dataKey="value" labelLine={false} label={renderPctLabel}>
                            {bookingByCategoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v} bookings`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5 min-w-0">
                    {bookingByCategoryData.map((item) => {
                        const total = bookingByCategoryData.reduce((s, i) => s + i.value, 0);
                        const pct = ((item.value / total) * 100).toFixed(1);
                        return (
                            <div key={item.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                                        <span className="text-xs font-medium text-slate-700 truncate">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 ml-2 flex-shrink-0">{pct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ChartCard>
    );
}

export function BookingStatusChart() {
    return (
        <ChartCard title="Booking Status Distribution" subtitle="Current status breakdown of all bookings">
            <div className="flex items-center gap-5">
                <ResponsiveContainer width="50%" height={210}>
                    <PieChart>
                        <Pie data={bookingStatusData} cx="50%" cy="50%" innerRadius={52} outerRadius={88}
                            dataKey="value" labelLine={false} label={renderPctLabel}>
                            {bookingStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3 min-w-0">
                    {bookingStatusData.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                                    <span className="text-xs font-bold text-slate-900">{item.value}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ChartCard>
    );
}

export function BookingBySourceChart() {
    return (
        <ChartCard title="Bookings by Source" subtitle="Which channels drive the most bookings">
            <ResponsiveContainer width="100%" height={210}>
                <BarChart data={bookingBySourceData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} width={72} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    <Bar dataKey="bookings" name="Bookings" radius={[0, 4, 4, 0]}>
                        {bookingBySourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function PartnerWorkloadChart() {
    return (
        <ChartCard title="Partner Workload" subtitle="Assigned vs completed jobs per partner">
            <ResponsiveContainer width="100%" height={210}>
                <BarChart data={partnerWorkloadData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="partner" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={32} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="assigned" name="Assigned" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}
