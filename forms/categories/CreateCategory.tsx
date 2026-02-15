"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import { createCategory } from '@/services/categories';
import useAxiosAuth from '@/hooks/authentication/useAxiosAuth';
import toast from 'react-hot-toast';

export default function CreateCategory({ onSuccess }: { onSuccess?: () => void }) {
    const authHeaders = useAxiosAuth();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            is_active: true,
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await createCategory(values, authHeaders);
                toast.success('Category created successfully');
                formik.resetForm();
                if (onSuccess) onSuccess();
            } catch (error) {
                toast.error('Failed to create category');
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6 w-full max-w-lg">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
            </div>

            <div className="flex items-center space-x-2">
                <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.is_active}
                    className="h-4 w-4 text-primary focus:ring-primary border-secondary rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">
                    Is Active
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Creating...' : 'Create Category'}
            </button>
        </form>
    );
}