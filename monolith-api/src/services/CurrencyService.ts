import { redisClient } from '@/config/redis';
import { CurrencyRepository } from '@/repositories/CurrencyRepository';

export class CurrencyService {
  private currencyRepository = new CurrencyRepository();
  private readonly BASE_CURRENCY = 'TRY';
  private readonly CACHE_KEY = 'currency:rates:v1';
  private readonly CACHE_TTL = 5 * 60;

  public getBaseCurrency(): string {
    return this.BASE_CURRENCY;
  }

  private async loadRatesCache(): Promise<void> {
    const cached = await redisClient.get(this.CACHE_KEY);
    if (cached) {
      return;
    }

    const currencies = await this.currencyRepository.findAll();

    const rates: Record<string, number> = {};
    currencies.forEach((currency) => {
      rates[currency.code] = Number(currency.rate);
    });

    await redisClient.setEx(this.CACHE_KEY, this.CACHE_TTL, JSON.stringify(rates));
  }

  private async getRate(currencyCode: string): Promise<number> {
    await this.loadRatesCache();

    const cached = await redisClient.get(this.CACHE_KEY);
    if (!cached) {
      throw new Error('Currency cache not available');
    }

    const rates: Record<string, number> = JSON.parse(cached);
    const rate = rates[currencyCode];

    if (rate === undefined) {
      throw new Error(`Currency not found: ${currencyCode}`);
    }

    return rate;
  }

  public async convertToBase(amountMinor: number, fromCurrency: string): Promise<number> {
    if (fromCurrency === this.BASE_CURRENCY) {
      return amountMinor;
    }

    const fromRate = await this.getRate(fromCurrency);
    const baseRate = await this.getRate(this.BASE_CURRENCY);

    const convertedAmount = Math.round(amountMinor * (baseRate / fromRate));

    return convertedAmount;
  }

  public async convert(
    amountMinor: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amountMinor;
    }

    const fromRate = await this.getRate(fromCurrency);
    const toRate = await this.getRate(toCurrency);

    const convertedAmount = Math.round(amountMinor * (toRate / fromRate));

    return convertedAmount;
  }

  public async getAllCurrencies() {
    await this.loadRatesCache();

    const cached = await redisClient.get(this.CACHE_KEY);
    if (!cached) {
      throw new Error('Currency cache not available');
    }

    const rates: Record<string, number> = JSON.parse(cached);
    return Object.entries(rates).map(([code, rate]) => ({
      code,
      rate,
    }));
  }

  public async getCurrencyRate(code: string) {
    const rate = await this.getRate(code);
    return { code, rate };
  }

  public async clearCache(): Promise<void> {
    await redisClient.del(this.CACHE_KEY);
  }
}
