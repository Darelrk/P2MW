import React from 'react';
import { X, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { Product } from './useProducts';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingProduct: Product | null;
    isSubmitting: boolean;
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ProductModal({
    isOpen,
    onClose,
    editingProduct,
    isSubmitting,
    imagePreview,
    onImageChange,
    onSubmit
}: ProductModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-forest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-forest/10 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="font-display font-bold text-xl text-forest">
                        {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h3>
                    <button onClick={onClose} className="text-forest/50 hover:text-forest p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    {/* Image Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-forest/70 mb-2">Foto Produk</label>
                        <div className="border-2 border-dashed border-forest/20 rounded-xl p-6 text-center hover:bg-cream-light/50 transition-colors relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {imagePreview ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 relative rounded-lg overflow-hidden mb-3 shadow-md">
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    </div>
                                    <p className="text-xs text-forest/60">Klik untuk mengganti gambar</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-4">
                                    <UploadCloud className="w-10 h-10 text-forest/40 mb-3" />
                                    <p className="text-sm font-medium text-forest/70">Unggah Foto Produk</p>
                                    <p className="text-xs text-forest/50 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-forest/70 mb-2">Nama Produk</label>
                            <input required name="name" defaultValue={editingProduct?.name} type="text" className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-forest/70 mb-2">Deskripsi (Opsional)</label>
                            <textarea name="description" defaultValue={editingProduct?.description || ''} rows={3} className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20"></textarea>
                        </div>

                        {/* Affordable Tier */}
                        <div className={cn(
                            "p-4 rounded-xl border transition-all duration-300",
                            "border-forest/10 bg-cream-light/30"
                        )}>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="radio"
                                    name="mainTier"
                                    id="tier-affordable"
                                    value="affordable"
                                    defaultChecked={editingProduct ? editingProduct.allowAffordable : true}
                                    className="w-4 h-4 accent-forest"
                                    required
                                />
                                <label htmlFor="tier-affordable" className="text-sm font-bold text-forest cursor-pointer">Affordable</label>
                            </div>
                            <label className="block text-xs font-medium text-forest/50 mb-1">Harga (Rp)</label>
                            <input name="priceAffordable" defaultValue={editingProduct?.priceAffordable || 0} type="number" min="0" className="w-full px-3 py-1.5 rounded-lg border border-forest/10 focus:outline-none focus:ring-2 focus:ring-forest/15 text-sm" />
                        </div>

                        {/* Standard Tier */}
                        <div className={cn(
                            "p-4 rounded-xl border transition-all duration-300",
                            "border-forest/10 bg-cream-light/30"
                        )}>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="radio"
                                    name="mainTier"
                                    id="tier-standard"
                                    value="standard"
                                    defaultChecked={editingProduct ? editingProduct.allowStandard : false}
                                    className="w-4 h-4 accent-forest"
                                />
                                <label htmlFor="tier-standard" className="text-sm font-bold text-forest cursor-pointer">Standard</label>
                            </div>
                            <label className="block text-xs font-medium text-forest/50 mb-1">Harga (Rp)</label>
                            <input name="priceStandard" defaultValue={editingProduct?.priceStandard || 0} type="number" min="0" className="w-full px-3 py-1.5 rounded-lg border border-forest/10 focus:outline-none focus:ring-2 focus:ring-forest/15 text-sm" />
                        </div>

                        {/* Premium Tier */}
                        <div className={cn(
                            "p-4 rounded-xl border transition-all duration-300",
                            "border-forest/10 bg-cream-light/30"
                        )}>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="radio"
                                    name="mainTier"
                                    id="tier-premium"
                                    value="premium"
                                    defaultChecked={editingProduct ? editingProduct.allowPremium : false}
                                    className="w-4 h-4 accent-forest"
                                />
                                <label htmlFor="tier-premium" className="text-sm font-bold text-forest cursor-pointer">Premium</label>
                            </div>
                            <label className="block text-xs font-medium text-forest/50 mb-1">Harga (Rp)</label>
                            <input name="pricePremium" defaultValue={editingProduct?.pricePremium || 0} type="number" min="0" className="w-full px-3 py-1.5 rounded-lg border border-forest/10 focus:outline-none focus:ring-2 focus:ring-forest/15 text-sm" />
                        </div>

                        {/* Special Tier */}
                        <div className="p-4 rounded-xl border border-terracotta/10 bg-terracotta/5">
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="checkbox"
                                    name="allowSpecial"
                                    id="tier-special"
                                    value="true"
                                    defaultChecked={editingProduct ? editingProduct.allowSpecial : false}
                                    className="w-4 h-4 accent-terracotta"
                                />
                                <label htmlFor="tier-special" className="text-sm font-bold text-terracotta cursor-pointer">Special</label>
                            </div>
                            <label className="block text-xs font-medium text-terracotta/50 mb-1">Harga (Rp)</label>
                            <input name="priceSpecial" defaultValue={editingProduct?.priceSpecial || 0} type="number" min="0" className="w-full px-3 py-1.5 rounded-lg border border-terracotta/10 focus:outline-none focus:ring-2 focus:ring-terracotta/15 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Stok Tersedia</label>
                            <input required name="stock" defaultValue={editingProduct?.stock || 0} type="number" min="0" className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Status Visibilitas</label>
                            <select name="status" defaultValue={editingProduct ? String(editingProduct.status) : "true"} className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20">
                                <option value="true">Aktif (Ditampilkan)</option>
                                <option value="false">Nonaktif (Disembunyikan)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-forest/10 flex justify-end gap-3 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border border-forest/20 text-forest font-medium hover:bg-forest/5 transition-colors">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-forest text-white font-medium hover:bg-forest-light transition-colors disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
