export enum Scope {
  WALLET_READ = 'wallet:read',
  WALLET_WRITE = 'wallet:write',
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',
  CART_READ = 'cart:read',
  CART_WRITE = 'cart:write',
  PRODUCTS_WRITE = 'products:write',
  CATEGORIES_WRITE = 'categories:write',
  ADMIN = 'admin',
}

export const ScopeGroups = {
  USER: [
    Scope.WALLET_READ,
    Scope.WALLET_WRITE,
    Scope.ORDERS_READ,
    Scope.ORDERS_WRITE,
    Scope.CART_READ,
    Scope.CART_WRITE,
  ],

  ADMIN: [
    Scope.WALLET_READ,
    Scope.WALLET_WRITE,
    Scope.ORDERS_READ,
    Scope.ORDERS_WRITE,
    Scope.CART_READ,
    Scope.CART_WRITE,
    Scope.PRODUCTS_WRITE,
    Scope.CATEGORIES_WRITE,
    Scope.ADMIN,
  ],
} as const;

export function hasScopes(userScopes: string[], requiredScopes: Scope[]): boolean {
  return requiredScopes.every((scope) => userScopes.includes(scope));
}
