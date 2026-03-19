import { getDashboardStats, getRecentOrders } from '@/db/queries'
import { formatCurrency } from '@/utils/currency'
import { Package, ShoppingBag, Clock, Layout, Coins, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default async function AdminDashboard() {
    const statsResult = await getDashboardStats();
    const stats = statsResult || { totalOrders: 0, revenue: 0, pendingOrders: 0, totalProducts: 0, totalOptions: 0 };
    const recentOrders = await getRecentOrders(5) || [];

    const statCards = [
        { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: Coins, color: 'text-forest', subValue: 'Penghasilan tervalidasi' },
        { label: 'Total Pesanan', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-forest', subValue: 'Seluruh riwayat pesanan' },
        { label: 'Pending / DP', value: stats.pendingOrders.toString(), icon: Clock, color: 'text-amber-600', subValue: 'Perlu verifikasi' },
        { label: 'Katalog Produk', value: stats.totalProducts.toString(), icon: Package, color: 'text-forest', subValue: 'Produk aktif saat ini' },
        { label: 'Opsi Builder', value: stats.totalOptions.toString(), icon: Layout, color: 'text-forest', subValue: 'Varian bunga & wrapping' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-display font-bold text-forest">Dashboard</h1>
                <p className="text-forest/60 text-sm mt-1">Ringkasan aktivitas toko dan manajemen website AMOUREA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-forest/10 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center shrink-0">
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-forest/40 uppercase tracking-wider">{card.label}</p>
                            <p className="text-2xl font-display font-bold text-forest mt-1">{card.value}</p>
                            <p className="text-[10px] text-forest/40 mt-1">{card.subValue}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-forest">Pesanan Terbaru</h2>
                    <Link href="/admin/orders" className="text-sm font-semibold text-forest flex items-center gap-1 hover:underline">
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-forest/10 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-forest/5 border-b border-forest/10">
                                <tr className="text-[11px] font-bold text-forest/60 uppercase tracking-widest">
                                    <th className="px-6 py-4">ID Pesanan</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-forest/5">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order: any) => (
                                        <tr key={order.id} className="text-sm hover:bg-forest/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-forest/60 font-bold">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-forest">{order.customerName}</p>
                                            </td>
                                            <td className="px-6 py-4 text-forest/60">
                                                {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: id })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-forest/5 text-forest/60'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-forest">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-forest/40 italic">
                                            Belum ada pesanan terbaru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
