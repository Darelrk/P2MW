import { db } from '@/db'
import { builderOptions } from '@/db/schema'
import { desc } from 'drizzle-orm'
import BuilderClient from './BuilderClient'

export const dynamic = 'force-dynamic'

export default async function AdminBuilderPage() {
    // Fetch options sorted by newest first
    const items = await db.select().from(builderOptions).orderBy(desc(builderOptions.createdAt))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-forest">Opsi Rakit Sendiri</h1>
                <p className="text-forest/60 text-sm mt-1">Kelola daftar Bunga, Warna Nuansa, dan Pembungkus untuk custom bouquet.</p>
            </div>

            <BuilderClient initialData={items} />
        </div>
    )
}
