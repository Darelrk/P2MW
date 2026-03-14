'use client'
import { X, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { Product } from './useProducts';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingProduct: Product | null;
    isSubmitting: boolean;
    imagePreview: string | null;
    modelFileName?: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onModelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ProductModal({
    isOpen,
    onClose,
    editingProduct,
    isSubmitting,
    imagePreview,
    modelFileName,
    onImageChange,
    onModelChange,
    onSubmit
}: ProductModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-forest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                <div className="p-6 border-b border-forest/10 flex justify-between items-center bg-white z-10">
                    <h3 className="font-display font-bold text-xl text-forest">
                        {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h3>
                    <button onClick={onClose} className="text-forest/50 hover:text-forest p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
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
                            <input required name="name" defaultValue={editingProduct?.name} type="text" placeholder="Masukkan nama produk..." className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-forest/70 mb-2">Deskripsi (Opsional)</label>
                            <textarea name="description" defaultValue={editingProduct?.description || ''} rows={3} placeholder="Ceritakan tentang buket ini..." className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20"></textarea>
                        </div>

                        {/* Pricing Tiers */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl border border-forest/10 bg-cream-light/30">
                                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                    <input type="radio" name="mainTier" value="affordable" defaultChecked={editingProduct ? editingProduct.allowAffordable : true} className="accent-forest" />
                                    <span className="text-xs font-bold text-forest">Affordable</span>
                                </label>
                                <input name="priceAffordable" defaultValue={editingProduct?.priceAffordable || 0} type="number" className="w-full px-3 py-1.5 rounded-lg border border-forest/10 text-sm" />
                            </div>
                            <div className="p-4 rounded-xl border border-forest/10 bg-cream-light/30">
                                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                    <input type="radio" name="mainTier" value="standard" defaultChecked={editingProduct ? editingProduct.allowStandard : false} className="accent-forest" />
                                    <span className="text-xs font-bold text-forest">Standard</span>
                                </label>
                                <input name="priceStandard" defaultValue={editingProduct?.priceStandard || 0} type="number" className="w-full px-3 py-1.5 rounded-lg border border-forest/10 text-sm" />
                            </div>
                            <div className="p-4 rounded-xl border border-forest/10 bg-cream-light/30">
                                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                    <input type="radio" name="mainTier" value="premium" defaultChecked={editingProduct ? editingProduct.allowPremium : false} className="accent-forest" />
                                    <span className="text-xs font-bold text-forest">Premium</span>
                                </label>
                                <input name="pricePremium" defaultValue={editingProduct?.pricePremium || 0} type="number" className="w-full px-3 py-1.5 rounded-lg border border-forest/10 text-sm" />
                            </div>
                            <div className="p-4 rounded-xl border border-terracotta/10 bg-terracotta/5">
                                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                    <input type="checkbox" name="allowSpecial" value="true" defaultChecked={editingProduct ? editingProduct.allowSpecial : false} className="accent-terracotta" />
                                    <span className="text-xs font-bold text-terracotta">Special Tier</span>
                                </label>
                                <input name="priceSpecial" defaultValue={editingProduct?.priceSpecial || 0} type="number" className="w-full px-3 py-1.5 rounded-lg border border-terracotta/10 text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Stok Tersedia</label>
                            <input required name="stock" defaultValue={editingProduct?.stock || 0} type="number" className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Jumlah Terjual (Sales)</label>
                            <input required name="soldCount" defaultValue={editingProduct?.soldCount || 0} type="number" className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-forest/70 mb-2">Status Visibilitas</label>
                            <select name="status" defaultValue={editingProduct ? String(editingProduct.status) : "true"} className="w-full px-4 py-2 rounded-lg border border-forest/20 focus:outline-none focus:ring-2 focus:ring-forest/20">
                                <option value="true">Aktif (Ditampilkan)</option>
                                <option value="false">Nonaktif (Disembunyikan)</option>
                            </select>
                        </div>

                        {/* AR Model Upload Section */}
                        <div className="md:col-span-2 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                            <div className="flex items-center gap-2 text-blue-800">
                                <span className="p-2 bg-blue-100 rounded-lg">📱</span>
                                <h4 className="font-bold text-sm">Visualisasi AR (3D Model .glb)</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600/70 uppercase tracking-wider">Upload File Baru</label>
                                    <div className="flex items-center gap-3">
                                        <input type="file" accept=".glb" onChange={onModelChange} className="hidden" id="model-upload" />
                                        <label htmlFor="model-upload" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                                            <UploadCloud className="w-4 h-4" />
                                            {modelFileName ? 'Ganti File' : 'Pilih File .glb'}
                                        </label>
                                        {modelFileName && <span className="text-[10px] text-blue-800 font-medium truncate max-w-[150px]">{modelFileName}</span>}
                                    </div>
                                    <p className="text-[10px] text-blue-600/50 italic">File akan otomatis disimpan di Cloud Storage.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-blue-600/70 uppercase tracking-wider">Atau Link Manual</label>
                                    <input name="modelUrl" defaultValue={editingProduct?.modelUrl || ''} type="text" placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-forest/10 flex justify-end gap-3 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border border-forest/20 text-forest font-medium hover:bg-forest/5 transition-colors">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-forest text-white font-medium hover:bg-forest-light transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
