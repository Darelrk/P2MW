'use client'

import { useState } from 'react'
import { Plus, History, ListFilter } from 'lucide-react'
import { BuilderTable } from './BuilderTable'
import { BuilderModal } from './BuilderModal'
import { useBuilder, type BuilderOption } from './useBuilder'
import { cn } from '@/lib/cn'

export default function BuilderClient({ initialData }: { initialData: BuilderOption[] }) {
    const [view, setView] = useState<'active' | 'history'>('active')

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

    const filteredData = initialData.filter(o => view === 'active' ? !o.isDeleted : o.isDeleted)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-forest/10 overflow-hidden">
            <div className="p-6 border-b border-forest/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-lg text-forest">
                        {view === 'active' ? 'Opsi Katalog' : 'Riwayat Opsi'}
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
                        Tambah Opsi
                    </button>
                )}
            </div>

            <BuilderTable
                options={filteredData}
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
