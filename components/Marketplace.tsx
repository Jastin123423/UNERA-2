import React, { useState, useEffect, useRef } from 'react';
import { User, Product } from '../types';
import { MARKETPLACE_CATEGORIES, MARKETPLACE_COUNTRIES } from '../constants';

// --- CREATE PRODUCT MODAL ---
interface CreateProductModalProps {
    currentUser: User;
    onClose: () => void;
    onCreate: (product: Product) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ currentUser, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(currentUser.phone || '');
    const [quantity, setQuantity] = useState('1');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setImagePreview(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!title.trim() || !price.trim() || !category || !imagePreview || !country || !address.trim()) {
            alert("Please fill in all required fields: title, price, category, image, country, and address.");
            return;
        }

        // Validate price is a positive number
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            alert("Please enter a valid price (positive number).");
            return;
        }

        setIsSubmitting(true);

        const newProduct: Product = {
            id: Date.now(),
            title: title.trim(),
            category,
            description: description.trim(),
            country,
            address: address.trim(),
            mainPrice: priceValue,
            quantity: parseInt(quantity) || 1,
            phoneNumber: phone.trim(),
            images: [imagePreview],
            sellerId: currentUser.id,
            sellerName: currentUser.name,
            sellerAvatar: currentUser.profileImage,
            date: Date.now(),
            status: 'active',
            shareId: `prod_${Date.now()}`,
            views: 0,
            ratings: [],
            comments: []
        };

        console.log('Creating product:', newProduct);
        onCreate(newProduct);
        onClose();
        setIsSubmitting(false);
   
