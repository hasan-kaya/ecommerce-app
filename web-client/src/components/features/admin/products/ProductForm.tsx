'use client';

import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { Product, Category } from '@/graphql/types';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '@/graphql/mutations/product';
import { GET_CATEGORIES } from '@/graphql/queries/categories';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

interface CategoriesResponse {
  categories: {
    categories: Category[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  slug: Yup.string()
    .required('Slug is required')
    .matches(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    )
    .min(2, 'Slug must be at least 2 characters')
    .max(255, 'Slug must be less than 255 characters'),
  priceMinor: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be positive'),
  currency: Yup.string()
    .required('Currency is required')
    .length(3, 'Currency must be 3 characters'),
  stockQty: Yup.number()
    .required('Stock quantity is required')
    .integer('Stock must be an integer')
    .min(0, 'Stock must be positive'),
  categoryId: Yup.string().required('Category is required'),
});

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function ProductForm({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormProps) {
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const { data: categoriesData } = useQuery<CategoriesResponse>(
    GET_CATEGORIES,
    {
      variables: { page: 1, pageSize: 100 },
    }
  );

  const categories = categoriesData?.categories?.categories || [];
  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      priceMinor: '',
      currency: 'TRY',
      stockQty: 0,
      categoryId: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Convert price to minor units (cents)
        const input = {
          ...values,
          priceMinor: Math.round(Number(values.priceMinor) * 100).toString(),
        };

        if (product) {
          await updateProduct({
            variables: {
              id: product.id,
              input,
            },
          });
        } else {
          await createProduct({
            variables: {
              input,
            },
          });
        }
        resetForm();
        onSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to save product:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (product) {
      formik.setValues({
        name: product.name,
        slug: product.slug,
        priceMinor: (Number(product.priceMinor) / 100).toString(),
        currency: product.currency,
        stockQty: product.stockQty,
        categoryId: product.category.id,
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOpen]);

  const handleNameChange = (name: string) => {
    formik.setFieldValue('name', name);
    // Auto-generate slug for both new and existing products
    formik.setFieldValue('slug', generateSlug(name));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Create Product'}
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
          required
          error={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : undefined
          }
        />

        <FormField
          label="Slug"
          id="slug"
          name="slug"
          type="text"
          value={formik.values.slug}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          error={
            formik.touched.slug && formik.errors.slug
              ? formik.errors.slug
              : undefined
          }
        />

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category: { id: string; name: string }) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.categoryId}
            </p>
          )}
        </div>

        <FormField
          label="Price"
          id="priceMinor"
          name="priceMinor"
          type="number"
          step="0.01"
          value={formik.values.priceMinor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          error={
            formik.touched.priceMinor && formik.errors.priceMinor
              ? formik.errors.priceMinor
              : undefined
          }
        />

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            name="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          {formik.touched.currency && formik.errors.currency && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.currency}
            </p>
          )}
        </div>

        <FormField
          label="Stock Quantity"
          id="stockQty"
          name="stockQty"
          type="number"
          value={formik.values.stockQty}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          error={
            formik.touched.stockQty && formik.errors.stockQty
              ? formik.errors.stockQty
              : undefined
          }
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
