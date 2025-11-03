export interface Wallet {
  id: string;
  currency: string;
  balanceMinor: string;
  createdAt: string;
}

export interface WalletsResponse {
  wallets: Wallet[];
}
