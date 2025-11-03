'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSubmit: (data: { name: string; slug: string }) => Promise<void>;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  slug: Yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters'),
});

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function CategoryForm({
  isOpen,
  onClose,
  category,
  onSubmit,
}: CategoryFormProps) {
  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit(values);
        resetForm();
      } catch (error) {
        console.error('Failed to save category:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (category) {
      formik.setValues({
        name: category.name,
        slug: category.slug,
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isOpen]);

  const handleNameChange = (name: string) => {
    formik.setFieldValue('name', name);
    if (!category) {
      // Auto-generate slug only for new categories
      formik.setFieldValue('slug', generateSlug(name));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create Category'}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormField
          label="Name"
          id="name"
          name="name"
          type="text"
          value={formik.values.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={formik.handleBlur}
          placeholder="e.g., Electronics"
          required
          error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
        />

        <FormField
          label="Slug"
          id="slug"
          name="slug"
          type="text"
          value={formik.values.slug}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="e.g., electronics"
          required
          error={formik.touched.slug && formik.errors.slug ? formik.errors.slug : undefined}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
            {formik.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
