'use client';

import {
    LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { monthlyRevenueData, categoryRevenueData, paymentMethodData } from '../data/revenueData';

const formatK = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null;
};

function ChartCard({ title, subtitle, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

export function MonthlyRevenueTrendChart() {
    return (
        <ChartCard title="Monthly Revenue Trend" subtitle="Full year revenue and collection overview">
            <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyRevenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={formatK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={52} />
                    <Tooltip formatter={(v) => formatK(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0, fill: '#2563EB' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="collections" name="Collections" stroke="#10b981" strokeWidth={2} dot={{ r: 3, strokeWidth: 0, fill: '#10b981' }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function RevenueVsExpensesChart() {
    return (
        <ChartCard title="Revenue vs Expenses" subtitle="Monthly comparison of income and spending">
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyRevenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={formatK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={52} />
                    <Tooltip formatter={(v) => formatK(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}

export function RevenueByCategoryChart() {
    return (
        <ChartCard title="Revenue by Service Category" subtitle="Contribution of each service to total revenue">
            <div className="flex items-center gap-6">
                <ResponsiveContainer width="55%" height={220}>
                    <PieChart>
                        <Pie
                            data={categoryRevenueData}
                            cx="50%"
                            cy="50%"
                            outerRadius={95}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {categoryRevenueData.map((entry, i) => (
                                <Cell key={`cell-${i}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5 min-w-0">
                    {categoryRevenueData.map((item) => {
                        const total = categoryRevenueData.reduce((s, i) => s + i.value, 0);
                        const pct = ((item.value / total) * 100).toFixed(1);
                        return (
                            <div key={item.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }}></div>
                                        <span className="text-xs font-medium text-slate-700 truncate">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 ml-2 flex-shrink-0">{pct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ChartCard>
    );
}

export function RevenueByPaymentMethodChart() {
    return (
        <ChartCard title="Revenue by Payment Method" subtitle="How customers prefer to pay">
            <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={220}>
                    <PieChart>
                        <Pie
                            data={paymentMethodData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={95}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {paymentMethodData.map((entry, i) => (
                                <Cell key={`cell-${i}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3 min-w-0">
                    {paymentMethodData.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }}></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                                    <span className="text-xs font-bold text-slate-900">{item.value}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ChartCard>
    );
}
