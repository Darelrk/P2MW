import { db } from '@/db'
import { products } from '@/db/schema'
import { desc } from 'drizzle-orm'
import ProductsClient from './ProductsClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    // Fetch products sorted by newest first
    const items = await db.select().from(products).orderBy(desc(products.createdAt))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-forest">Katalog Express</h1>
                <p className="text-forest/60 text-sm mt-1">Kelola daftar buket bunga siap kirim untuk jalur Express.</p>
            </div>

            <ProductsClient initialData={items} />
        </div>
    )
}
