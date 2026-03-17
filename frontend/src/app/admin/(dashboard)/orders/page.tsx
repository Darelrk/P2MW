import { getOrders } from '@/actions/orderActions'
import OrdersClient from './OrdersClient'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    const orders = await getOrders()

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-forest">
                    Manajemen Pesanan
                </h1>
                <p className="text-forest/60 mt-1 font-body text-sm">
                    Kelola dan verifikasi pembayaran pelanggan dari WhatsApp.
                </p>
            </div>

            <OrdersClient initialData={orders} />
        </div>
    )
}
