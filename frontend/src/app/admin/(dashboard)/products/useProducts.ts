import { useState } from 'react';
import { createProduct, updateProduct, deleteProduct } from '@/actions/adminActions';
import { uploadFile } from '@/actions/storageActions';
import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
    maxSizeMB: 0.1, // Target under 100KB
    maxWidthOrHeight: 800, // Sufficient for catalog
    useWebWorker: true,
    fileType: 'image/webp'
};

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
};

export function useProducts() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [modelFile, setModelFile] = useState<File | null>(null);

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setImagePreview(product.imageUrl);
        } else {
            setEditingProduct(null);
            setImagePreview(null);
        }
        setImageFile(null);
        setModelFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview(null);
        setModelFile(null);
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

    const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setModelFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);

            let finalImageUrl = editingProduct?.imageUrl || '';
            let finalModelUrl = editingProduct?.modelUrl || '';

            // Handle Image Upload
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

                const uploadRes = await uploadFile(imgFormData, 'products');
                if (!uploadRes.success) {
                    alert('Gagal mengupload gambar: ' + uploadRes.error);
                    setIsSubmitting(false);
                    return;
                }
                finalImageUrl = uploadRes.publicUrl!;
            }

            // Handle Model Upload
            if (modelFile) {
                const modelFormData = new FormData();
                modelFormData.append('file', modelFile);

                const uploadRes = await uploadFile(modelFormData, 'product-models');
                if (!uploadRes.success) {
                    alert('Gagal mengupload model: ' + uploadRes.error);
                    setIsSubmitting(false);
                    return;
                }
                finalModelUrl = uploadRes.publicUrl!;
            }

            formData.set('imageUrl', finalImageUrl);
            formData.set('modelUrl', finalModelUrl);

            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                await createProduct(formData);
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
        if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
            try {
                await deleteProduct(id);
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Gagal menghapus produk.');
            }
        }
    };

    return {
        isModalOpen,
        editingProduct,
        isSubmitting,
        imagePreview,
        modelFileName: modelFile?.name,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleModelChange,
        handleSubmit,
        handleDelete
    };
}
