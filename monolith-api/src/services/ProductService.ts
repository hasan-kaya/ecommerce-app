import { AppError } from '@/common/middleware/error';
import { Product } from '@/entities/Product';
import { ProductRepository } from '@/repositories/ProductRepository';
import { CurrencyService } from '@/services/CurrencyService';

export class ProductService {
  private productRepository = new ProductRepository();
  private currencyService = new CurrencyService();

  private async convertProductPrices(product: Product) {
    const priceInBase = await this.currencyService.convertToBase(
      Number(product.priceMinor),
      product.currency
    );

    return {
      ...product,
      priceMinor: priceInBase,
      currency: this.currencyService.getBaseCurrency(),
    };
  }

  private async convertProductsPrices(products: Product[]) {
    return Promise.all(products.map((p) => this.convertProductPrices(p)));
  }

  async getProducts(
    page: number = 1,
    pageSize: number = 10,
    categorySlug?: string,
    search?: string
  ) {
    const result = await this.productRepository.findWithPagination(
      page,
      pageSize,
      categorySlug,
      search
    );

    const productsWithConvertedPrices = await this.convertProductsPrices(result.products);

    return {
      ...result,
      products: productsWithConvertedPrices,
    };
  }

  async getProduct(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return this.convertProductPrices(product);
  }

  async decreaseProductStock(productId: string, quantity: number) {
    const product = await this.productRepository.decreaseStock(productId, quantity);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    slug: string;
    priceMinor: string;
    currency: string;
    stockQty: number;
    categoryId: string;
  }) {
    const existingProduct = await this.productRepository.findBySlug(data.slug);
    if (existingProduct) {
      throw new AppError('Product with this slug already exists', 409);
    }

    return this.productRepository.create(data);
  }

  async updateProduct(
    id: string,
    data: {
      name: string;
      slug: string;
      priceMinor: string;
      currency: string;
      stockQty: number;
      categoryId: string;
    }
  ) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const existingProduct = await this.productRepository.findBySlug(data.slug);
    if (existingProduct && existingProduct.id !== id) {
      throw new AppError('Product with this slug already exists', 409);
    }

    const updated = await this.productRepository.update(id, data);
    if (!updated) {
      throw new AppError('Failed to update product', 500);
    }
    return updated;
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return this.productRepository.delete(id);
  }
}
