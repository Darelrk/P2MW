'use client'
import React from 'react';

import { createProduct, updateProduct, deleteProduct } from '@/actions/adminActions';
import { useBaseCrud } from '@/hooks/useBaseCrud';
import { ProductSchema } from '@/lib/validations';

export type Product = {
    id: string;
    name: string;
    description: string | null;
    priceAffordable: number;
    priceStandard: number;
    pricePremium: number;
    priceSpecial: number;
    allowAffordable: boolean;
    allowStandard: boolean;
    allowPremium: boolean;
    allowSpecial: boolean;
    status: boolean;
    imageUrl: string | null;
    modelUrl: string | null;
    stock: number;
    soldCount: number;
    isDeleted: boolean;
};

export function useProducts() {
    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    const {
        isModalOpen,
        editingItem: editingProduct,
        isSubmitting,
        setIsSubmitting,
        imagePreview,
        modelFileName,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleModelChange,
        processFileUploads,
        getValidatedData,
        toast
    } = useBaseCrud<Product>({
        schema: ProductSchema,
        uploadBucket: 'products',
        modelBucket: 'product-models'
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = (async () => {
            const form = e.currentTarget;
            const formData = new FormData(form);
            
            // Use abstract validation
            const validatedData = getValidatedData(formData);
            if (!validatedData) throw new Error('Data validasi tidak ditemukan');

            const { finalImageUrl, finalModelUrl } = await processFileUploads(
                editingProduct?.imageUrl,
                editingProduct?.modelUrl
            );

            formData.set('imageUrl', finalImageUrl || '');
            formData.set('modelUrl', finalModelUrl || '');
            formData.set('status', String(validatedData.status)); 

            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                return 'Produk berhasil diperbarui';
            } else {
                await createProduct(formData);
                return 'Produk berhasil ditambahkan';
            }
        })();

        toast.promise(promise, {
            loading: 'Sedang menyimpan...',
            success: (data) => {
                handleCloseModal();
                return data;
            },
            error: (err) => err.message || 'Gagal menyimpan produk'
        });

        try {
            await promise;
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Hapus produk "${name}"?`)) return;

        setDeletingId(id);
        const promise = deleteProduct(id);

        toast.promise(promise, {
            loading: 'Menghapus...',
            success: 'Produk berhasil dihapus',
            error: 'Gagal menghapus produk'
        });

        try {
            await promise;
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return {
        isModalOpen,
        editingProduct,
        isSubmitting,
        deletingId,
        imagePreview,
        modelFileName,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleModelChange,
        handleSubmit,
        handleDelete
    };
}
