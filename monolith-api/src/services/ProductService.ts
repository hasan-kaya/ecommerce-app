import { AppError } from '@/common/middleware/error';
import { Product } from '@/entities/Product';
import { ProductRepository } from '@/repositories/ProductRepository';
import { CurrencyService } from '@/services/CurrencyService';

export class ProductService {
  private productRepository = new ProductRepository();
  private currencyService = new CurrencyService();

  private async convertProductPrices(product: Product) {
    const priceInBase = await this.currencyService.convertToBase(
      Number(product.price_minor),
      product.currency
    );

    return {
      ...product,
      price_minor: priceInBase,
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
}
