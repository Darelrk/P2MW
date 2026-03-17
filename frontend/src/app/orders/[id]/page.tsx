import { getOrderById } from '@/actions/orderActions'
import { notFound } from 'next/navigation'
import OrderTracker from './OrderTracker'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrderById(id)
    return {
        title: order ? `Pesanan #${order.orderNumber} | AMOUREA` : 'Pesanan Tidak Ditemukan',
    }
}

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrderById(id)

    if (!order) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <OrderTracker order={order} />
            </div>
        </div>
    )
}
