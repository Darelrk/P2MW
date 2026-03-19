'use client'

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { uploadFile } from '@/actions/storageActions';
import { compressImage } from '@/utils/fileUpload';

interface BaseCrudConfig<T> {
    onSuccess?: (data: T | string | { success: boolean }) => void;
    onError?: (err: any) => void;
    uploadBucket?: string;
    modelBucket?: string;
    schema?: z.ZodSchema<Partial<T> | Record<string, any>>;
}

export function useBaseCrud<T extends { id: string; imageUrl?: string | null; [key: string]: any }>(
    config: BaseCrudConfig<T> = {}
) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [modelFile, setModelFile] = useState<File | null>(null);

    const handleOpenModal = (item?: T) => {
        if (item) {
            setEditingItem(item);
            setImagePreview(item.imageUrl || null);
        } else {
            setEditingItem(null);
            setImagePreview(null);
        }
        setImageFile(null);
        setModelFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
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

    const processFileUploads = async (currentImageUrl?: string | null, currentModelUrl?: string | null) => {
        let finalImageUrl = currentImageUrl || '';
        let finalModelUrl = currentModelUrl || '';

        // Handle Image
        if (imageFile) {
            const fileToUpload = await compressImage(imageFile);
            
            const imgFormData = new FormData();
            imgFormData.append('file', fileToUpload);
            imgFormData.append('bucket', config.uploadBucket || 'products');
            
            const { data: res, error } = await uploadFile(imgFormData);
            if (error || !res) throw new Error(error || 'Gagal mengunggah gambar');
            finalImageUrl = res.url!;
        }

        // Handle Model
        if (modelFile) {
            const modelFormData = new FormData();
            modelFormData.append('file', modelFile);
            modelFormData.append('bucket', config.modelBucket || 'product-models');
            
            const { data: res, error } = await uploadFile(modelFormData);
            if (error || !res) throw new Error(error || 'Gagal mengunggah model');
            finalModelUrl = res.url!;
        }

        return { finalImageUrl, finalModelUrl };
    };

    const getValidatedData = (formData: FormData) => {
        if (!config.schema) return null;
        const rawData = Object.fromEntries(formData.entries());
        const result = config.schema.safeParse(rawData);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }
        return result.data;
    };

    return {
        isModalOpen,
        editingItem,
        isSubmitting,
        setIsSubmitting,
        imagePreview,
        modelFileName: modelFile?.name,
        handleOpenModal,
        handleCloseModal,
        handleImageChange,
        handleModelChange,
        processFileUploads,
        getValidatedData,
        toast
    };
}
