'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Clock, Check, Package, CircleCheck, X, ArrowLeft, Wallet, Camera, Upload, ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import { uploadPaymentProof } from '@/actions/uploadProof'
import { toast } from 'sonner'

type OrderTrackerProps = {
    order: {
        id: string
        orderNumber: string
        customerName: string
        totalAmount: number
        paymentMethod?: string
        dpAmount?: number
        paidAmount?: number
        paymentProofUrl?: string | null
        finalPaymentProofUrl?: string | null
        status: string
        createdAt: Date
        items: Array<{
            id: string
            itemType: string
            quantity: number
            subtotal: number
        }>
    }
}

function getStepsForMethod(paymentMethod: string) {
    if (paymentMethod === 'dp') {
        return [
            { key: 'pending', label: 'Menunggu DP', icon: Clock, description: 'Admin sedang mengecek pembayaran DP Anda.' },
            { key: 'dp_paid', label: 'DP Diterima', icon: Wallet, description: 'DP telah terverifikasi. Sisa bayar saat produk siap.' },
            { key: 'processing', label: 'Sedang Dirangkai', icon: Package, description: 'Buket sedang dirangkai dengan penuh kasih.' },
            { key: 'paid', label: 'Lunas', icon: Check, description: 'Pembayaran penuh telah dikonfirmasi.' },
            { key: 'completed', label: 'Pesanan Selesai', icon: CircleCheck, description: 'Pesanan telah selesai. Terima kasih!' },
        ]
    }
    if (paymentMethod === 'final') {
        return [
            { key: 'pending', label: 'Pesanan Diterima', icon: Clock, description: 'Pesanan Anda diterima. Pembayaran saat serah terima.' },
            { key: 'processing', label: 'Sedang Dirangkai', icon: Package, description: 'Buket sedang dirangkai dengan penuh kasih.' },
            { key: 'paid', label: 'Pembayaran Diterima', icon: Check, description: 'Pembayaran telah dikonfirmasi saat serah terima.' },
            { key: 'completed', label: 'Pesanan Selesai', icon: CircleCheck, description: 'Pesanan telah selesai. Terima kasih!' },
        ]
    }
    // Default: full payment
    return [
        { key: 'pending', label: 'Menunggu Pembayaran', icon: Clock, description: 'Admin sedang mengecek mutasi rekening.' },
        { key: 'paid', label: 'Pembayaran Terverifikasi', icon: Check, description: 'Pembayaran telah dikonfirmasi oleh admin.' },
        { key: 'processing', label: 'Sedang Dirangkai', icon: Package, description: 'Buket sedang dirangkai dengan penuh kasih.' },
        { key: 'completed', label: 'Pesanan Selesai', icon: CircleCheck, description: 'Pesanan telah selesai. Terima kasih!' },
    ]
}

function getStepIndex(status: string, steps: { key: string }[]) {
    if (status === 'cancelled') return -1
    const idx = steps.findIndex(s => s.key === status)
    return idx >= 0 ? idx : 0
}

const PAYMENT_LABELS: Record<string, string> = {
    full: 'Bayar Lunas',
    dp: 'DP 50%',
    final: 'Bayar di Akhir',
}

/**
 * Client-side image compression using Canvas
 */
async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                }, 'image/jpeg', 0.8);
            };
        };
        reader.onerror = (error) => reject(error);
    });
}

function PaymentProofUpload({ orderId, isFinal, label, currentUrl }: { orderId: string, isFinal: boolean, label: string, currentUrl?: string | null }) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(currentUrl || null)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
        }
    }

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            const compressed = await compressImage(file);
            const formData = new FormData();
            formData.append('file', compressed);

            const res = await uploadPaymentProof(orderId, formData, isFinal);
            if (res.success) {
                toast.success('Bukti pembayaran berhasil diunggah!');
                setPreview(res.url || null);
                setFile(null);
            } else {
                toast.error(res.error || 'Gagal mengunggah bukti');
            }
        } catch (error) {
            console.error('Upload catch:', error);
            toast.error('Terjadi kesalahan saat mengunggah');
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="bg-forest/5 border border-forest/10 rounded-2xl p-4 mt-4">
            <p className="text-xs font-bold text-forest/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" />
                {label} (Opsional)
            </p>
            
            <div className="flex items-center gap-4">
                {preview ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-forest/20 grow-0 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Proof Preview" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-lg bg-forest/5 border-2 border-dashed border-forest/10 flex items-center justify-center grow-0 shrink-0">
                        <ImageIcon className="w-6 h-6 text-forest/20" />
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    {!file && !currentUrl ? (
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-forest/20 rounded-xl text-sm font-medium text-forest hover:bg-forest/5 cursor-pointer transition-colors shadow-sm">
                            <Upload className="w-4 h-4" />
                            Pilih Foto Resi
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    ) : file ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="flex-1 bg-forest text-cream py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-forest-light transition-colors shadow-lg shadow-forest/20 disabled:opacity-50"
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                Konfirmasi Kirim
                            </button>
                            <button
                                onClick={() => { setFile(null); setPreview(currentUrl || null); }}
                                className="p-2 border border-red-200 text-red-500 rounded-xl"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Bukti Terkirim
                        </p>
                    )}
                    <p className="text-[10px] text-forest/40 italic">Membantu admin verifikasi lebih cepat tanpa cek WA secara manual.</p>
                </div>
            </div>
        </div>
    )
}

export default function OrderTracker({ order }: OrderTrackerProps) {
    const [currentStatus, setCurrentStatus] = useState(order.status)
    const [animateStep, setAnimateStep] = useState(false)

    const paymentMethod = order.paymentMethod || 'full'
    const steps = getStepsForMethod(paymentMethod)

    // Supabase Realtime subscription
    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel(`order-${order.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${order.id}`,
                },
                (payload) => {
                    const newStatus = payload.new.status as string
                    if (newStatus !== currentStatus) {
                        setAnimateStep(true)
                        setCurrentStatus(newStatus)
                        setTimeout(() => setAnimateStep(false), 1500)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [order.id, currentStatus])

    const stepIndex = getStepIndex(currentStatus, steps)
    const isCancelled = currentStatus === 'cancelled'

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-forest/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-forest to-forest-light p-6 text-cream">
                <Link href="/" className="inline-flex items-center gap-1.5 text-cream/60 text-xs hover:text-cream mb-3 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Kembali ke Beranda
                </Link>
                <h1 className="font-display text-2xl font-bold tracking-wide">AMOUREA</h1>
                <p className="text-cream/70 text-sm mt-1">Pelacakan Pesanan</p>
                <div className="mt-4 bg-white/10 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-cream/50 uppercase tracking-wider">ID Pesanan</span>
                        <span className="font-mono font-bold text-sm">#{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-cream/50 uppercase tracking-wider">Total</span>
                        <span className="font-bold">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-cream/50 uppercase tracking-wider">Metode</span>
                        <span className="text-xs font-medium bg-white/15 px-2 py-0.5 rounded-full">{PAYMENT_LABELS[paymentMethod] || paymentMethod}</span>
                    </div>
                    {paymentMethod === 'dp' && order.dpAmount && (
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-cream/50 uppercase tracking-wider">DP</span>
                            <span className="text-xs font-medium">Rp {order.dpAmount.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Cancelled */}
            {isCancelled && (
                <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-red-600">Pesanan Dibatalkan</h2>
                    <p className="text-forest/50 text-sm mt-2">Pesanan ini telah dibatalkan. Silakan hubungi admin untuk informasi lebih lanjut.</p>
                </div>
            )}

            {/* Progress Steps */}
            {!isCancelled && (
                <div className="p-6 space-y-1">
                    {steps.map((step, index) => {
                        const isCompleted = index <= stepIndex
                        const isCurrent = index === stepIndex
                        const Icon = step.icon

                        return (
                            <div key={step.key} className="flex gap-4">
                                {/* Line + Dot */}
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700',
                                        isCompleted
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'bg-white border-forest/15 text-forest/30',
                                        isCurrent && animateStep && 'animate-bounce'
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={cn(
                                            'w-0.5 h-8 my-1 transition-all duration-500',
                                            isCompleted ? 'bg-emerald-400' : 'bg-forest/10'
                                        )} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="pb-4 flex-1">
                                    <p className={cn(
                                        'font-semibold text-sm transition-colors',
                                        isCompleted ? 'text-forest' : 'text-forest/35'
                                    )}>
                                        {step.label}
                                    </p>
                                    {isCurrent && (
                                        <p className="text-xs text-forest/50 mt-0.5">{step.description}</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Payment Upload Card (Optional) */}
            {!isCancelled && stepIndex < steps.length - 1 && (
                <div className="p-6 pt-0">
                    {/* DP CASE */}
                    {paymentMethod === 'dp' && (
                        <>
                            {currentStatus === 'pending' && (
                                <PaymentProofUpload 
                                    orderId={order.id} 
                                    isFinal={false} 
                                    label="Unggah Bukti DP" 
                                    currentUrl={order.paymentProofUrl}
                                />
                            )}
                            {['dp_paid', 'processing'].includes(currentStatus) && (
                                <PaymentProofUpload 
                                    orderId={order.id} 
                                    isFinal={true} 
                                    label="Unggah Bukti Pelunasan" 
                                    currentUrl={order.finalPaymentProofUrl}
                                />
                            )}
                        </>
                    )}

                    {/* FULL CASE */}
                    {paymentMethod === 'full' && currentStatus === 'pending' && (
                        <PaymentProofUpload 
                            orderId={order.id} 
                            isFinal={false} 
                            label="Unggah Bukti Bayar" 
                            currentUrl={order.paymentProofUrl}
                        />
                    )}

                    {/* FINAL CASE (No upload needed usually, but could be optional for cash/scan proof at end) */}
                </div>
            )}

            {/* Footer */}
            <div className="bg-cream-light/50 p-4 text-center">
                <p className="text-xs text-forest/40">
                    Status diperbarui secara otomatis. Simpan halaman ini untuk pelacakan.
                </p>
            </div>
        </div>
    )
}
