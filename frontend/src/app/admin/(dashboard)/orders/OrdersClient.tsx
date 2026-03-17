'use client'

import { useState, useTransition } from 'react'
import { Check, X, MessageCircle, Clock, Package, Truck, CircleCheck, Filter, CreditCard, Wallet, Banknote } from 'lucide-react'
import { updateOrderStatus } from '@/actions/orderActions'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/utils/currency'

type Order = {
    id: string
    orderNumber: string
    customerName: string
    customerPhone: string
    customerAddress: string
    deliveryType: string
    totalAmount: number
    paymentMethod: string
    dpAmount: number
    paidAmount: number
    paymentProofUrl: string | null
    finalPaymentProofUrl: string | null
    status: string
    adminNotes: string | null
    verifiedAt: Date | null
    createdAt: Date
    updatedAt: Date
    items?: OrderItem[]
}

type OrderItem = {
    id: string
    itemType: string
    productId: string | null
    quantity: number
    subtotal: number
    product?: {
        name: string
        imageUrl: string | null
        description: string | null
    }
    customDetails?: Record<string, any> | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
    pending: { label: 'Menunggu', color: 'text-amber-600', icon: <Clock className="w-4 h-4" />, bg: 'bg-amber-50 border-amber-200' },
    dp_paid: { label: 'DP Diterima', color: 'text-indigo-600', icon: <Wallet className="w-4 h-4" />, bg: 'bg-indigo-50 border-indigo-200' },
    paid: { label: 'Lunas', color: 'text-emerald-600', icon: <Check className="w-4 h-4" />, bg: 'bg-emerald-50 border-emerald-200' },
    processing: { label: 'Diproses', color: 'text-blue-600', icon: <Package className="w-4 h-4" />, bg: 'bg-blue-50 border-blue-200' },
    completed: { label: 'Selesai', color: 'text-green-700', icon: <CircleCheck className="w-4 h-4" />, bg: 'bg-green-50 border-green-200' },
    cancelled: { label: 'Dibatalkan', color: 'text-red-600', icon: <X className="w-4 h-4" />, bg: 'bg-red-50 border-red-200' },
}

const PAYMENT_METHOD_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    full: { label: 'Lunas', icon: <CreditCard className="w-3 h-3" />, color: 'text-emerald-600 bg-emerald-50' },
    dp: { label: 'DP 50%', icon: <Wallet className="w-3 h-3" />, color: 'text-indigo-600 bg-indigo-50' },
    final: { label: 'Bayar Akhir', icon: <Banknote className="w-3 h-3" />, color: 'text-amber-600 bg-amber-50' },
}

function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', config.bg, config.color)}>
            {config.icon}
            {config.label}
        </span>
    )
}

function PaymentBadge({ method }: { method: string }) {
    const config = PAYMENT_METHOD_CONFIG[method] || PAYMENT_METHOD_CONFIG.full
    return (
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold', config.color)}>
            {config.icon}
            {config.label}
        </span>
    )
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}


export default function OrdersClient({ initialData }: { initialData: Order[] }) {
    const [filter, setFilter] = useState<string>('all')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [noteInputs, setNoteInputs] = useState<Record<string, string>>({})
    const router = useRouter()

    const filteredOrders = filter === 'all'
        ? initialData
        : initialData.filter(o => o.status === filter)

    const pendingCount = initialData.filter(o => o.status === 'pending').length

    function handleStatusChange(orderId: string, newStatus: string) {
        const notes = noteInputs[orderId]
        startTransition(async () => {
            const result = await updateOrderStatus(orderId, newStatus, notes)
            if (result.success) {
                toast.success(`Status berhasil diubah menjadi "${STATUS_CONFIG[newStatus]?.label || newStatus}"`)
                router.refresh()
            } else {
                toast.error(result.error || 'Gagal memperbarui status')
            }
        })
    }

    function openWhatsApp(phone: string, orderNumber: string) {
        const message = encodeURIComponent(
            `Halo! Terkait pesanan ${orderNumber} di AMOUREA, pembayaran Anda telah kami terima. Buket akan segera dirangkai. Terima kasih! 💐`
        )
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    }

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const count = initialData.filter(o => o.status === key).length
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(filter === key ? 'all' : key)}
                            className={cn(
                                'flex items-center gap-2 p-3 rounded-xl border transition-all text-left',
                                filter === key ? 'ring-2 ring-forest/30 shadow-md' : 'hover:shadow-sm',
                                config.bg
                            )}
                        >
                            <div className={cn('p-1.5 rounded-lg', config.color)}>{config.icon}</div>
                            <div>
                                <p className="text-xl font-bold text-forest">{count}</p>
                                <p className="text-xs text-forest/50">{config.label}</p>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Filter Info */}
            {filter !== 'all' && (
                <div className="flex items-center gap-2 text-sm text-forest/60">
                    <Filter className="w-4 h-4" />
                    <span>Menampilkan pesanan: <strong>{STATUS_CONFIG[filter]?.label}</strong></span>
                    <button onClick={() => setFilter('all')} className="text-terracotta underline ml-2">Tampilkan Semua</button>
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-forest/10 overflow-hidden">
                <div className="p-6 border-b border-forest/10 flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-forest flex items-center gap-2">
                        Daftar Pesanan
                        {pendingCount > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                {pendingCount} Baru
                            </span>
                        )}
                    </h3>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-forest/40">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Belum ada pesanan{filter !== 'all' ? ` dengan status "${STATUS_CONFIG[filter]?.label}"` : ''}.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-forest/5">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="hover:bg-cream-light/30 transition-colors">
                                {/* Row */}
                                <button
                                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                    className="w-full p-4 sm:p-5 flex items-center gap-4 text-left"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-mono text-sm font-bold text-forest">{order.orderNumber}</span>
                                            <StatusBadge status={order.status} />
                                            <PaymentBadge method={order.paymentMethod} />
                                        </div>
                                        <p className="text-sm text-forest/70 mt-1 truncate">{order.customerName} &middot; {order.customerPhone}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-forest">{formatCurrency(order.totalAmount)}</p>
                                        {order.paymentMethod === 'dp' && order.paidAmount > 0 && order.paidAmount < order.totalAmount && (
                                            <p className="text-xs text-indigo-500 font-medium">Sisa: {formatCurrency(order.totalAmount - order.paidAmount)}</p>
                                        )}
                                        <p className="text-xs text-forest/40 mt-0.5">{formatDate(order.createdAt)}</p>
                                    </div>
                                </button>

                                {/* Expanded Detail */}
                                {expandedId === order.id && (
                                    <div className="px-5 pb-5 space-y-4 border-t border-dashed border-forest/10 pt-4 bg-cream-light/20">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-forest/50 text-xs uppercase tracking-wider mb-1">Pelanggan</p>
                                                <p className="font-medium text-forest">{order.customerName}</p>
                                                <p className="text-forest/60">{order.customerPhone}</p>
                                                <p className="text-forest/60">{order.customerAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-forest/50 text-xs uppercase tracking-wider mb-1">Pesanan</p>
                                                <p className="text-forest/70">Tipe: <strong>{order.deliveryType}</strong></p>
                                                <p className="text-forest/70">Total: <strong>{formatCurrency(order.totalAmount)}</strong></p>
                                                <p className="text-forest/70">Metode: <strong>{PAYMENT_METHOD_CONFIG[order.paymentMethod]?.label || order.paymentMethod}</strong></p>
                                                {order.paymentMethod === 'dp' && (
                                                    <>
                                                        <p className="text-indigo-600 text-xs mt-1">DP: {formatCurrency(order.dpAmount)} | Dibayar: {formatCurrency(order.paidAmount)} | Sisa: {formatCurrency(order.totalAmount - order.paidAmount)}</p>
                                                    </>
                                                )}
                                                {order.verifiedAt && (
                                                    <p className="text-emerald-600 text-xs mt-1">✓ Diverifikasi: {formatDate(order.verifiedAt)}</p>
                                                )}
                                                {order.adminNotes && (
                                                    <p className="text-forest/50 text-xs mt-1 italic">Catatan: {order.adminNotes}</p>
                                                )}

                                                {/* Payment Proofs */}
                                                {(order.paymentProofUrl || order.finalPaymentProofUrl) && (
                                                    <div className="mt-3 flex gap-3">
                                                        {order.paymentProofUrl && (
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] text-forest/40 uppercase font-bold">Bukti DP/Lunas</p>
                                                                <a 
                                                                    href={order.paymentProofUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="block w-16 h-16 rounded-lg border border-forest/20 overflow-hidden hover:opacity-80 transition-opacity"
                                                                >
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={order.paymentProofUrl} alt="Bukti 1" className="w-full h-full object-cover" />
                                                                </a>
                                                            </div>
                                                        )}
                                                        {order.finalPaymentProofUrl && (
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] text-forest/40 uppercase font-bold">Bukti Pelunasan</p>
                                                                <a 
                                                                    href={order.finalPaymentProofUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="block w-16 h-16 rounded-lg border border-forest/20 overflow-hidden hover:opacity-80 transition-opacity"
                                                                >
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={order.finalPaymentProofUrl} alt="Bukti 2" className="w-full h-full object-cover" />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Items Breakdown */}
                                        <div className="border border-forest/10 rounded-xl overflow-hidden bg-white/50">
                                            <div className="bg-forest/5 px-4 py-2 border-b border-forest/10">
                                                <h4 className="text-[10px] font-bold text-forest/60 uppercase tracking-widest">Rincian Item Pesanan</h4>
                                            </div>
                                            <div className="divide-y divide-forest/5">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="px-4 py-3 flex items-start gap-4">
                                                        {/* Thumbnail */}
                                                        <div className="w-12 h-12 rounded-lg bg-forest/5 border border-forest/10 overflow-hidden shrink-0 flex items-center justify-center">
                                                            {item.itemType === 'express' && item.product?.imageUrl ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-forest/20" />
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-forest truncate">
                                                                    {item.itemType === 'express' ? (item.product?.name || 'Produk Tidak Dikenal') : 'Custom Bouquet'}
                                                                </span>
                                                                <span className="shrink-0 px-2 py-0.5 bg-forest/5 text-forest/60 text-[10px] rounded-full font-bold uppercase">
                                                                    {item.itemType}
                                                                </span>
                                                            </div>

                                                            {/* Composition / Description for Admin */}
                                                            {item.itemType === 'express' && item.product?.description && (
                                                                <p className="mt-0.5 text-[11px] text-forest/50 leading-relaxed italic">
                                                                    Detail: {item.product.description}
                                                                </p>
                                                            )}

                                                            {item.itemType === 'custom' && item.customDetails && (
                                                                <div className="mt-1 text-xs text-forest/60 space-y-0.5">
                                                                    {Object.entries(item.customDetails as Record<string, any>).map(([key, val]) => (
                                                                        <div key={key} className="flex gap-1">
                                                                            <span className="capitalize font-medium">{key}:</span>
                                                                            <span>{String(val)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <p className="text-[10px] font-bold text-forest/30 mt-1 uppercase tracking-wider">Jumlah: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right shrink-0 py-1">
                                                            <p className="text-sm font-bold text-forest">{formatCurrency(item.subtotal)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-cream-light/30 px-4 py-2 flex justify-between items-center border-t border-forest/10">
                                                <span className="text-xs font-bold text-forest/60 uppercase">Total Pesanan</span>
                                                <span className="text-sm font-black text-forest">{formatCurrency(order.totalAmount)}</span>
                                            </div>
                                        </div>

                                        {/* Admin Notes Input */}
                                        <div>
                                            <label className="text-xs text-forest/50 uppercase tracking-wider block mb-1">Catatan Admin</label>
                                            <input
                                                type="text"
                                                placeholder="Misal: Transfer via BCA a/n Budi"
                                                value={noteInputs[order.id] || order.adminNotes || ''}
                                                onChange={(e) => setNoteInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                className="w-full px-3 py-2 border border-forest/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => openWhatsApp(order.customerPhone, order.orderNumber)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Chat WA
                                            </button>

                                            {/* Pending → Confirm Payment */}
                                            {order.status === 'pending' && order.paymentMethod === 'dp' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'dp_paid')}
                                                    disabled={isPending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Wallet className="w-4 h-4" />
                                                    Konfirmasi DP
                                                </button>
                                            )}

                                            {order.status === 'pending' && order.paymentMethod !== 'dp' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'paid')}
                                                    disabled={isPending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Konfirmasi Bayar
                                                </button>
                                            )}

                                            {/* DP Paid → Confirm full payment (sisa) */}
                                            {order.status === 'dp_paid' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'paid')}
                                                    disabled={isPending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Lunasi Sisa
                                                </button>
                                            )}

                                            {order.status === 'paid' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'processing')}
                                                    disabled={isPending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Package className="w-4 h-4" />
                                                    Mulai Proses
                                                </button>
                                            )}

                                            {order.status === 'processing' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'completed')}
                                                    disabled={isPending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
                                                >
                                                    <CircleCheck className="w-4 h-4" />
                                                    Selesai
                                                </button>
                                            )}

                                            {(['pending', 'dp_paid', 'paid'].includes(order.status)) && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'cancelled')}
                                                    disabled={isPending}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Batalkan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
