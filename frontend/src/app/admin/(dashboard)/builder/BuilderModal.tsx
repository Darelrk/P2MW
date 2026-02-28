import React from 'react';
import { X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import type { BuilderOption } from './useBuilder';

interface BuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingOption: BuilderOption | null;
    isSubmitting: boolean;
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function BuilderModal({
    isOpen,
    onClose,
    editingOption,
    isSubmitting,
    imagePreview,
    onImageChange,
    onSubmit
}: BuilderModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-forest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-forest/10 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="font-display font-bold text-xl text-forest">
                        {editingOption ? 'Edit Opsi' : 'Tambah Opsi Baru'}
                    </h3>
                    <button onClick={onClose} className="text-forest/50 hover:text-forest p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    {/* Image Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-forest/70 mb-2">Foto Referensi</label>
                        <div className="border-2 border-dashed border-forest/20 rounded-xl p-6 text-center hover:bg-cream-light/50 transition-colors relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {imagePreview ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 relative rounded-lg overflow-hidden mb-3 shadow-md">
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    </div>
                                    <p className="text-xs text-forest/60">Klik untuk mengganti gambar</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-2">
                                    <UploadCloud className="w-8 h-8 text-forest/40 mb-2" />
                                    <p className="text-sm font-medium text-forest/70">Unggah Foto (Opsional)</p>
                                    <p className="text-xs text-forest/50 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Nama Opsi</label>
                            <input required name="name" defaultValue={editingOption?.name} type="text" className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Kategori</label>
                            <select name="category" defaultValue={editingOption?.category || "flower"} className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20">
                                <option value="flower">Bunga Utama (Flower)</option>
                                <option value="color">Nuansa Warna (Color)</option>
                                <option value="wrapper">Pembungkus (Wrapper)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Tambahan Harga (Rp)</label>
                            <input required name="priceAdjustment" defaultValue={editingOption?.priceAdjustment || 0} type="number" min="0" className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Ketersediaan Stok</label>
                            <select name="isAvailable" defaultValue={editingOption ? String(editingOption.isAvailable) : "true"} className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20">
                                <option value="true">Tersedia (Ready)</option>
                                <option value="false">Habis (Kosong)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-forest/10 flex justify-end gap-3 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border border-forest/20 text-forest font-medium hover:bg-forest/5 transition-colors">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-forest text-white font-medium hover:bg-forest-light transition-colors disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Opsi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
