import { getAllProductsAdmin } from '@/db/queries'
import { products } from '@/db/schema'
import { type InferSelectModel } from 'drizzle-orm'
import ProductsClient from './ProductsClient'

export const dynamic = 'force-dynamic'

type Product = InferSelectModel<typeof products>;

export default async function AdminProductsPage() {
    let items: Product[] = [];
    
    try {
        // Fetch all products using secured query
        items = await getAllProductsAdmin() as Product[];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to empty array
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-forest">Katalog Express</h1>
                <p className="text-forest/60 text-sm mt-1">Kelola daftar buket bunga siap kirim untuk jalur Express.</p>
            </div>

            {items.length === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-sm italic">
                    Perhatian: Gagal terhubung ke database atau data kosong. Silakan muat ulang atau periksa koneksi.
                </div>
            )}

            <ProductsClient initialData={items} />
        </div>
    )
}
