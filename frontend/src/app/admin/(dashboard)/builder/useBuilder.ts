'use client'

import { createBuilderOption, updateBuilderOption, deleteBuilderOption } from '@/actions/adminActions';
import { useBaseCrud } from '@/hooks/useBaseCrud';
import { BuilderOptionSchema } from '@/lib/validations';

export type BuilderOption = {
    id: string;
    category: string;
    name: string;
    isAvailable: boolean;
    priceAdjustment: number;
    imageUrl: string | null;
    isDeleted: boolean;
};

export function useBuilder() {
    const {
        isModalOpen,
        editingItem: editingOption,
        isSubmitting,
        setIsSubmitting,
        imagePreview,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        processFileUploads,
        getValidatedData,
        toast
    } = useBaseCrud<BuilderOption>({
        schema: BuilderOptionSchema,
        uploadBucket: 'builder-options'
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const promise = (async () => {
            const form = e.currentTarget;
            const formData = new FormData(form);
            
            // Use abstract validation
            const validatedData = getValidatedData(formData);

            const { finalImageUrl } = await processFileUploads(
                editingOption?.imageUrl
            );

            formData.set('imageUrl', finalImageUrl);
            formData.set('isAvailable', String(validatedData.isAvailable));

            if (editingOption) {
                await updateBuilderOption(editingOption.id, formData);
                return 'Opsi berhasil diperbarui';
            } else {
                await createBuilderOption(formData);
                return 'Opsi berhasil ditambahkan';
            }
        })();

        toast.promise(promise, {
            loading: 'Sedang menyimpan...',
            success: (data) => {
                handleCloseModal();
                return data;
            },
            error: (err) => err.message || 'Gagal menyimpan opsi'
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
        if (!window.confirm(`Hapus opsi "${name}"?`)) return;

        const promise = deleteBuilderOption(id);

        toast.promise(promise, {
            loading: 'Menghapus...',
            success: 'Opsi berhasil dihapus',
            error: 'Gagal menghapus opsi'
        });

        try {
            await promise;
        } catch (err) {
            console.error(err);
        }
    };

    return {
        isModalOpen,
        editingOption,
        isSubmitting,
        imagePreview,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleSubmit,
        handleDelete
    };
}
