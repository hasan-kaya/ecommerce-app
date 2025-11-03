export interface Product {
  id: string;
  name: string;
  slug: string;
  priceMinor: string;
  currency: string;
  stockQty: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
