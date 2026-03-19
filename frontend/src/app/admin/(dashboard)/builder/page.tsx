import { getAllBuilderOptionsAdmin } from '@/db/queries'
import { builderOptions } from '@/db/schema'
import { type InferSelectModel } from 'drizzle-orm'
import BuilderClient from './BuilderClient'

export const dynamic = 'force-dynamic'

type BuilderOption = InferSelectModel<typeof builderOptions>;

export default async function AdminBuilderPage() {
    let items: BuilderOption[] = [];
    
    try {
        // Fetch options using secured query
        items = await getAllBuilderOptionsAdmin() as BuilderOption[];
    } catch (error) {
        console.error('Failed to fetch builder options:', error);
        // Fallback to empty array
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-forest">Opsi Rakit Sendiri</h1>
                <p className="text-forest/60 text-sm mt-1">Kelola daftar Bunga, Warna Nuansa, dan Pembungkus untuk custom bouquet.</p>
            </div>

            {items.length === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-sm italic">
                    Perhatian: Gagal terhubung ke database atau data kosong. Silakan muat ulang atau periksa koneksi.
                </div>
            )}

            <BuilderClient initialData={items} />
        </div>
    )
}
