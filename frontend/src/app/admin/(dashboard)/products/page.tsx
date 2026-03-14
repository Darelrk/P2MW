import { db } from '@/db'
import { products } from '@/db/schema'
import { desc, InferSelectModel, eq } from 'drizzle-orm'
import ProductsClient from './ProductsClient'

export const dynamic = 'force-dynamic'

type Product = InferSelectModel<typeof products>;

export default async function AdminProductsPage() {
    // Fetch all products sorted by newest first (to support history view)
    const items = await db.select()
        .from(products)
        .orderBy(desc(products.createdAt)) as Product[];

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
