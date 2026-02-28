import { useState } from 'react';
import { createBuilderOption, updateBuilderOption, deleteBuilderOption } from '@/actions/adminActions';
import { uploadImage } from '@/actions/storageActions';
import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
    maxSizeMB: 0.1, // Target under 100KB
    maxWidthOrHeight: 800, // Sufficient for catalog
    useWebWorker: true,
    fileType: 'image/webp'
};

export type BuilderOption = {
    id: string;
    category: string;
    name: string;
    isAvailable: boolean;
    priceAdjustment: number;
    imageUrl: string | null;
};

export function useBuilder() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<BuilderOption | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleOpenModal = (option?: BuilderOption) => {
        if (option) {
            setEditingOption(option);
            setImagePreview(option.imageUrl);
        } else {
            setEditingOption(null);
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOption(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);

            let finalImageUrl = editingOption?.imageUrl || '';

            if (imageFile) {
                let fileToUpload = imageFile;

                try {
                    const compressedFile = await imageCompression(imageFile, COMPRESSION_OPTIONS);
                    if (compressedFile.size < imageFile.size) {
                        fileToUpload = compressedFile;
                    }
                } catch (error) {
                    console.warn("Image compression failed, proceeding with original file:", error);
                }

                const imgFormData = new FormData();
                imgFormData.append('file', fileToUpload);

                const uploadRes = await uploadImage(imgFormData);
                if (!uploadRes.success) {
                    alert('Gagal mengupload gambar: ' + uploadRes.error);
                    setIsSubmitting(false);
                    return;
                }
                finalImageUrl = uploadRes.publicUrl!;
            }

            formData.set('imageUrl', finalImageUrl);

            if (editingOption) {
                await updateBuilderOption(editingOption.id, formData);
            } else {
                await createBuilderOption(formData);
            }

            handleCloseModal();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Kesalahan sistem.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus opsi "${name}"?`)) {
            try {
                await deleteBuilderOption(id);
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Gagal menghapus opsi.');
            }
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
