import { AppError } from '@/common/middleware/error';
import { Product } from '@/entities/Product';
import { ProductRepository } from '@/repositories/ProductRepository';
import { CacheService } from '@/services/CacheService';
import { CurrencyService } from '@/services/CurrencyService';

export class ProductService {
  private productRepository = new ProductRepository();
  private currencyService = new CurrencyService();
  private cacheService = new CacheService();
  private readonly PRODUCTS_TTL = 180; // 3 minutes
  private readonly PRODUCT_TTL = 120; // 2 minutes

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
    const shouldCache = page === 1 && !search;
    const cacheKey = shouldCache
      ? this.cacheService.getProductsKey(categorySlug, page, pageSize, search)
      : null;

    if (cacheKey) {
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const result = await this.productRepository.findWithPagination(
      page,
      pageSize,
      categorySlug,
      search
    );

    const productsWithConvertedPrices = await this.convertProductsPrices(result.products);

    const response = {
      ...result,
      products: productsWithConvertedPrices,
    };

    if (cacheKey) {
      await this.cacheService.set(cacheKey, response, this.PRODUCTS_TTL);
    }

    return response;
  }

  async getProduct(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return this.convertProductPrices(product);
  }

  async getProductBySlug(slug: string) {
    const cacheKey = this.cacheService.getProductKey(slug);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const converted = await this.convertProductPrices(product);
    await this.cacheService.set(cacheKey, converted, this.PRODUCT_TTL);
    return converted;
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

    const product = await this.productRepository.create(data);

    // Invalidate all products cache (including category-specific)
    await this.cacheService.delPattern(this.cacheService.getProductsPatternAll());

    return product;
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

    // Invalidate product cache and all products lists
    await this.cacheService.del(this.cacheService.getProductKey(product.slug));
    if (product.slug !== data.slug) {
      await this.cacheService.del(this.cacheService.getProductKey(data.slug));
    }
    await this.cacheService.delPattern(this.cacheService.getProductsPatternAll());

    return updated;
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const result = await this.productRepository.delete(id);

    // Invalidate product cache and all products lists
    await this.cacheService.del(this.cacheService.getProductKey(product.slug));
    await this.cacheService.delPattern(this.cacheService.getProductsPatternAll());

    return result;
  }
}
