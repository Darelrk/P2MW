import React from 'react';
import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';
import type { Product } from './useProducts';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string, name: string) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-forest/80">
                <thead className="bg-cream-light text-forest font-semibold border-b border-forest/10">
                    <tr>
                        <th className="px-6 py-4">Produk</th>
                        <th className="px-6 py-4">Kategori Harga Aktif</th>
                        <th className="px-6 py-4">Stok</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                    {products.map((item, index) => (
                        <tr key={item.id} className="hover:bg-cream-light/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cream-dark/20 rounded-lg overflow-hidden relative flex-shrink-0">
                                        {item.imageUrl ? (
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" priority={index < 4} sizes="48px" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-forest/30 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-forest">{item.name}</p>
                                        <p className="text-xs text-forest/50 truncate max-w-[200px]">{item.description}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {item.allowAffordable && (
                                        <span className="text-[10px] bg-sage/20 text-forest px-1.5 py-0.5 rounded">Affordable</span>
                                    )}
                                    {item.allowStandard && (
                                        <span className="text-[10px] bg-sage/20 text-forest px-1.5 py-0.5 rounded">Standard</span>
                                    )}
                                    {item.allowPremium && (
                                        <span className="text-[10px] bg-sage/20 text-forest px-1.5 py-0.5 rounded">Premium</span>
                                    )}
                                    {item.allowSpecial && (
                                        <span className="text-[10px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded">Special</span>
                                    )}
                                    {!item.allowAffordable && !item.allowStandard && !item.allowPremium && !item.allowSpecial && (
                                        <span className="text-[10px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded">No Active Tier</span>
                                    )}
                                </div>
                                <div className="mt-1 space-y-0.5 text-xs">
                                    {item.allowAffordable && (
                                        <p className="font-medium">Rp {item.priceAffordable.toLocaleString('id-ID')}</p>
                                    )}
                                    {item.allowStandard && (
                                        <p className="font-medium">Rp {item.priceStandard.toLocaleString('id-ID')}</p>
                                    )}
                                    {item.allowPremium && (
                                        <p className="font-medium">Rp {item.pricePremium.toLocaleString('id-ID')}</p>
                                    )}
                                    {item.allowSpecial && (
                                        <p className="font-medium text-terracotta">Rp {item.priceSpecial.toLocaleString('id-ID')} (Special)</p>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">{item.stock}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.status ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="p-2 text-forest/60 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors inline-block"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id, item.name)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block ml-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-forest/50">
                                Belum ada produk. Tambahkan produk pertama Anda.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
