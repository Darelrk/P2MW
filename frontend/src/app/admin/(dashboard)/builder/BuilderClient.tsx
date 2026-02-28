'use client'

import { Plus } from 'lucide-react'
import { BuilderTable } from './BuilderTable'
import { BuilderModal } from './BuilderModal'
import { useBuilder, type BuilderOption } from './useBuilder'

export default function BuilderClient({ initialData }: { initialData: BuilderOption[] }) {
    const {
        isModalOpen,
        editingOption,
        isSubmitting,
        imagePreview,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleSubmit,
        handleDelete
    } = useBuilder()

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-forest/10 overflow-hidden">
            <div className="p-6 border-b border-forest/10 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-forest">Daftar Komponen Bunga</h3>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Opsi
                </button>
            </div>

            <BuilderTable
                options={initialData}
                onEdit={(o) => handleOpenModal(o)}
                onDelete={handleDelete}
            />

            <BuilderModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editingOption={editingOption}
                isSubmitting={isSubmitting}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
