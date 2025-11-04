/* eslint-disable no-undef */
import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  vus: 1, // 1 virtual user for e2e test
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'], // Less than 10% of requests should fail
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const GRAPHQL_URL = `${BASE_URL}/graphql`;

// Helper function to make GraphQL requests
function graphqlRequest(query, variables = {}, headers = {}) {
  const payload = JSON.stringify({
    query,
    variables,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  return http.post(GRAPHQL_URL, payload, params);
}

export default function () {
  // Get session token from environment variable
  const sessionToken = __ENV.SESSION_TOKEN;

  if (!sessionToken) {
    console.error('SESSION_TOKEN environment variable is required');
    console.error('');
    console.error('How to get your session token:');
    console.error('1. Open http://localhost:3000 in your browser');
    console.error('2. Login with your account');
    console.error('3. Open DevTools (F12) → Application → Cookies');
    console.error('4. Copy the "session_token" cookie value');
    console.error('5. Run: k6 run --env SESSION_TOKEN=your_token e2e-graphql.test.js');
    return;
  }

  console.log('\n=== Starting E2E Order Flow Test ===\n');

  let walletId = null;
  let cartId = null;
  let productId = null;
  let orderId = null;
  let initialBalance = 0;

  // ==========================================
  // STEP 1: Get Wallet
  // ==========================================
  console.log('Step 1: Get Wallet');
  const getWalletQuery = `
    query GetWallets {
      wallets {
        id
        balanceMinor
        currency
      }
    }
  `;

  console.log('Using session token:', sessionToken.substring(0, 50) + '...');

  const walletRes = graphqlRequest(
    getWalletQuery,
    {},
    {
      Cookie: `session_token=${sessionToken}`,
    }
  );

  console.log('Wallet response status:', walletRes.status);
  console.log('Wallet response body:', walletRes.body.substring(0, 300));

  check(walletRes, {
    'Wallet retrieved': (r) => r.status === 200,
    'Wallet exists': (r) => {
      try {
        const body = JSON.parse(r.body);
        if (body.data && body.data.wallets && body.data.wallets.length > 0) {
          walletId = body.data.wallets[0].id;
          initialBalance = parseInt(body.data.wallets[0].balanceMinor);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to parse wallet response:', r.body.substring(0, 300), err);
        return false;
      }
    },
  });

  if (!walletId) {
    console.error('Failed to get wallet');
    return;
  }

  console.log(`✓ Wallet retrieved with ID: ${walletId}`);
  sleep(1);

  // ==========================================
  // STEP 2: Top Up Wallet
  // ==========================================
  console.log('Step 2: Top Up Wallet');
  const topUpAmount = 10000000; // 100000 TRY in minor units
  const topUpMutation = `
    mutation TopUpWallet($currency: String!, $amountMinor: Int!) {
      topUpWallet(currency: $currency, amountMinor: $amountMinor) {
        id
        balanceMinor
        currency
      }
    }
  `;

  const topUpRes = graphqlRequest(
    topUpMutation,
    { currency: 'TRY', amountMinor: topUpAmount },
    { Cookie: `session_token=${sessionToken}` }
  );

  check(topUpRes, {
    'Top up successful': (r) => r.status === 200,
    'Balance updated': (r) => {
      const body = JSON.parse(r.body);
      return (
        body.data && body.data.topUpWallet && body.data.topUpWallet.balanceMinor >= topUpAmount
      );
    },
  });

  console.log(`✓ Wallet topped up with ${topUpAmount / 100} TRY`);
  sleep(1);

  // ==========================================
  // STEP 3: Get Products
  // ==========================================
  console.log('Step 3: Get Products');
  const getProductsQuery = `
    query GetProducts {
      products(page: 1, pageSize: 5) {
        products {
          id
          name
          slug
          priceMinor
          currency
          stockQty
        }
        total
      }
    }
  `;

  const productsRes = graphqlRequest(getProductsQuery);

  check(productsRes, {
    'Products retrieved': (r) => r.status === 200,
    'Products available': (r) => {
      const body = JSON.parse(r.body);
      if (body.data && body.data.products && body.data.products.products.length > 0) {
        // Select first product with stock
        const availableProduct = body.data.products.products.find((p) => p.stockQty > 0);
        if (availableProduct) {
          productId = availableProduct.id;
          return true;
        }
      }
      return false;
    },
  });

  if (!productId) {
    console.error('No products available:', productsRes.body);
    return;
  }

  console.log(`✓ Product selected with ID: ${productId}`);
  sleep(1);

  // ==========================================
  // STEP 4: Add Product to Cart
  // ==========================================
  console.log('Step 4: Add Product to Cart');
  const addToCartMutation = `
    mutation AddToCart($productId: ID!, $qty: Int!) {
      addToCart(productId: $productId, qty: $qty) {
        id
        cartItems {
          id
          qty
          product {
            id
            name
            priceMinor
          }
        }
      }
    }
  `;

  const addToCartRes = graphqlRequest(
    addToCartMutation,
    { productId, qty: 2 },
    { Cookie: `session_token=${sessionToken}` }
  );

  check(addToCartRes, {
    'Product added to cart': (r) => r.status === 200,
    'Cart has items': (r) => {
      const body = JSON.parse(r.body);
      if (body.data && body.data.addToCart) {
        cartId = body.data.addToCart.id;
        return body.data.addToCart.cartItems.length > 0;
      }
      return false;
    },
  });

  if (!cartId) {
    console.error('Failed to add to cart:', addToCartRes.body);
    return;
  }

  console.log(`✓ Product added to cart (ID: ${cartId})`);
  sleep(1);

  // ==========================================
  // STEP 5: Get Cart
  // ==========================================
  console.log('Step 5: Get Cart');
  const getCartQuery = `
    query GetCart {
      cart {
        id
        cartItems {
          id
          qty
          product {
            id
            name
            priceMinor
          }
        }
        totalPrice
      }
    }
  `;

  const getCartRes = graphqlRequest(getCartQuery, {}, { Cookie: `session_token=${sessionToken}` });

  check(getCartRes, {
    'Cart retrieved': (r) => r.status === 200,
    'Cart contains items': (r) => {
      const body = JSON.parse(r.body);
      return body.data && body.data.cart && body.data.cart.cartItems.length > 0;
    },
  });

  console.log('✓ Cart retrieved successfully');
  sleep(1);

  // ==========================================
  // STEP 6: Create Order (Checkout)
  // ==========================================
  console.log('Step 6: Create Order');
  const checkoutMutation = `
    mutation Checkout($walletCurrency: String!) {
      checkout(walletCurrency: $walletCurrency) {
        id
        status
        priceMinor
        currency
        items {
          id
          qty
          priceMinor
          product {
            name
          }
        }
      }
    }
  `;

  const checkoutRes = graphqlRequest(
    checkoutMutation,
    { walletCurrency: 'TRY' },
    { Cookie: `session_token=${sessionToken}` }
  );

  check(checkoutRes, {
    'Order created': (r) => r.status === 200,
    'Order has ID': (r) => {
      const body = JSON.parse(r.body);
      if (body.data && body.data.checkout) {
        orderId = body.data.checkout.id;
        return true;
      }
      return false;
    },
    'Order status is PENDING': (r) => {
      const body = JSON.parse(r.body);
      return body.data && body.data.checkout && body.data.checkout.status === 'PENDING';
    },
  });

  if (!orderId) {
    console.error('Failed to create order:', checkoutRes.body);
    return;
  }

  console.log(`✓ Order created with ID: ${orderId}`);
  sleep(1);

  // ==========================================
  // STEP 7: Verify Wallet Balance Deducted
  // ==========================================
  console.log('Step 7: Verify Wallet Balance');
  const finalWalletRes = graphqlRequest(
    getWalletQuery,
    {},
    {
      Cookie: `session_token=${sessionToken}`,
    }
  );

  check(finalWalletRes, {
    'Final wallet balanceMinor retrieved': (r) => r.status === 200,
    'Balance deducted': (r) => {
      const body = JSON.parse(r.body);
      if (body.data && body.data.wallets[0]) {
        const finalBalance = parseInt(body.data.wallets[0].balanceMinor);
        const expectedBalance = initialBalance + topUpAmount;
        console.log(
          `Initial: ${initialBalance / 100} TRY, After topup: ${expectedBalance / 100} TRY, Final: ${finalBalance / 100} TRY`
        );
        return finalBalance < expectedBalance;
      }
      return false;
    },
  });

  console.log('✓ Wallet balance deducted correctly');

  console.log(`\n=== E2E Test Completed Successfully ===\n`);
  console.log(`Wallet: ${walletId}`);
  console.log(`Order: ${orderId}`);
  console.log(`\n======================================\n`);
}
