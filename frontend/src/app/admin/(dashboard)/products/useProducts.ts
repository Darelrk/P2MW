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

            const dataToSubmit = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                priceAffordable: Number(formData.get('priceAffordable')),
                priceStandard: Number(formData.get('priceStandard')),
                pricePremium: Number(formData.get('pricePremium')),
                priceSpecial: Number(formData.get('priceSpecial')),
                mainTier: formData.get('mainTier') as any,
                allowSpecial: formData.get('allowSpecial') === 'true',
                status: formData.get('status') === 'true',
                imageUrl: finalImageUrl || null,
                modelUrl: finalModelUrl || null,
                stock: Number(formData.get('stock')),
                soldCount: Number(formData.get('soldCount'))
            };

            if (editingProduct) {
                const res = await updateProduct({ id: editingProduct.id, ...dataToSubmit });
                if (res.error) throw new Error(res.error);
                return 'Produk berhasil diperbarui';
            } else {
                const res = await createProduct(dataToSubmit);
                if (res.error) throw new Error(res.error);
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
        const promise = (async () => {
            const res = await deleteProduct({ id });
            if (res.error) throw new Error(res.error);
            return res.data;
        })();

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
