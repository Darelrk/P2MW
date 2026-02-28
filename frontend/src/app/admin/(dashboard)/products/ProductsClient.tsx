'use client'

import { Plus } from 'lucide-react'
import { ProductTable } from './ProductTable'
import { ProductModal } from './ProductModal'
import { useProducts, type Product } from './useProducts'

export default function ProductsClient({ initialData }: { initialData: Product[] }) {
    const {
        isModalOpen,
        editingProduct,
        isSubmitting,
        imagePreview,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleSubmit,
        handleDelete
    } = useProducts()

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-forest/10 overflow-hidden">
            <div className="p-6 border-b border-forest/10 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-forest">Daftar Produk</h3>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                </button>
            </div>

            <ProductTable
                products={initialData}
                onEdit={(p) => handleOpenModal(p)}
                onDelete={handleDelete}
            />

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editingProduct={editingProduct}
                isSubmitting={isSubmitting}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
