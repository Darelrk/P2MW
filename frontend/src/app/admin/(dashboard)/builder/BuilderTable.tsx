import React from 'react';
import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';
import type { BuilderOption } from './useBuilder';

interface BuilderTableProps {
    options: BuilderOption[];
    onEdit: (option: BuilderOption) => void;
    onDelete: (id: string, name: string) => void;
}

export function BuilderTable({ options, onEdit, onDelete }: BuilderTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-forest/80">
                <thead className="bg-cream-light text-forest font-semibold border-b border-forest/10">
                    <tr>
                        <th className="px-6 py-4">Nama Opsi</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4">Tambahan Harga</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                    {options.map((item, index) => (
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
                                    <p className="font-medium text-forest truncate max-w-[200px]">{item.name}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="capitalize bg-forest/5 text-forest px-3 py-1 rounded-md text-xs font-semibold">
                                    {item.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium">
                                + Rp {item.priceAdjustment.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.isAvailable ? 'Tersedia' : 'Habis'}
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
                    {options.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-forest/50">
                                Belum ada opsi rakit sendiri.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
