export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-forest">Dashboard</h1>
                <p className="text-forest/60 text-sm mt-1">Ringkasan aktivitas toko dan manajemen website AMOUREA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {/* Placeholder Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-forest/10">
                    <p className="text-sm text-forest/60 font-medium">Total Pesanan</p>
                    <p className="text-3xl font-bold text-forest mt-2">--</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-forest/10">
                    <p className="text-sm text-forest/60 font-medium">Total Produk Express</p>
                    <p className="text-3xl font-bold text-forest mt-2">--</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-forest/10">
                    <p className="text-sm text-forest/60 font-medium">Opsi Rakit Tersedia</p>
                    <p className="text-3xl font-bold text-forest mt-2">--</p>
                </div>
            </div>
        </div>
    )
}
