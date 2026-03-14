'use client'

import { useState } from 'react'
import { Plus, History, ListFilter } from 'lucide-react'
import { ProductTable } from './ProductTable'
import { ProductModal } from './ProductModal'
import { useProducts, type Product } from './useProducts'
import { cn } from '@/lib/cn'

export default function ProductsClient({ initialData }: { initialData: Product[] }) {
    const [view, setView] = useState<'active' | 'history'>('active')
    
    const {
        isModalOpen,
        editingProduct,
        isSubmitting,
        imagePreview,
        modelFileName,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleModelChange,
        handleSubmit,
        handleDelete
    } = useProducts()

    const filteredData = (initialData || []).filter(p => view === 'active' ? !p.isDeleted : p.isDeleted)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-forest/10 overflow-hidden">
            <div className="p-6 border-b border-forest/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-lg text-forest">
                        {view === 'active' ? 'Katalog Aktif' : 'Riwayat Katalog'}
                    </h3>
                    <div className="flex p-1 bg-cream-light rounded-xl border border-forest/5">
                        <button 
                            onClick={() => setView('active')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                view === 'active' ? "bg-white text-forest shadow-sm" : "text-forest/40 hover:text-forest/60"
                            )}
                        >
                            <ListFilter className="w-3.5 h-3.5" />
                            Aktif
                        </button>
                        <button 
                            onClick={() => setView('history')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                view === 'history' ? "bg-white text-forest shadow-sm" : "text-forest/40 hover:text-forest/60"
                            )}
                        >
                            <History className="w-3.5 h-3.5" />
                            Riwayat
                        </button>
                    </div>
                </div>

                {view === 'active' && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Produk
                    </button>
                )}
            </div>

            <ProductTable
                products={filteredData}
                onEdit={(p) => handleOpenModal(p)}
                onDelete={handleDelete}
            />

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editingProduct={editingProduct}
                isSubmitting={isSubmitting}
                imagePreview={imagePreview}
                modelFileName={modelFileName}
                onImageChange={handleImageChange}
                onModelChange={handleModelChange}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
