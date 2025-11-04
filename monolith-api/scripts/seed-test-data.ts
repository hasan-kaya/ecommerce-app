import { AppDataSource } from '../src/config/data-source';
import { redisClient } from '../src/config/redis';
import { Category } from '../src/entities/Category';
import { Product } from '../src/entities/Product';
import { User, UserRole } from '../src/entities/User';
import { Wallet } from '../src/entities/Wallet';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'; // Valid UUID for test user
const TEST_SESSION_TOKEN = 'ce8d4e24ce258fe39d2bc6961812a8af197f9c8776bbe2e9f7dacc2adfd7dfcd';

async function seedTestData() {
  try {
    console.log('🌱 Starting test data seeding...');

    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Initialize Redis connection
    await redisClient.connect();
    console.log('✅ Redis connected');

    // Clear existing test data
    await AppDataSource.manager.delete(User, { id: TEST_USER_ID });
    console.log('🧹 Cleared existing test user');

    // Create test user
    const user = new User();
    user.id = TEST_USER_ID;
    user.email = 'test@example.com';
    user.name = 'Test User';
    user.role = UserRole.USER;
    await AppDataSource.manager.save(user);
    console.log('✅ Created test user:', user.email);

    // Create test wallet
    const wallet = new Wallet();
    wallet.user = user;
    wallet.balance_minor = 1000000; // 10,000 TRY
    wallet.currency = 'TRY';
    await AppDataSource.manager.save(wallet);
    console.log('✅ Created test wallet with balance: 10,000 TRY');

    // Create test categories
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
      },
      { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
      { name: 'Books', slug: 'books', description: 'Books and magazines' },
    ];

    for (const cat of categories) {
      const existing = await AppDataSource.manager.findOne(Category, {
        where: { name: cat.name },
      });
      if (!existing) {
        const category = AppDataSource.manager.create(Category, cat);
        await AppDataSource.manager.save(category);
        console.log(`✅ Created category: ${cat.name}`);
      }
    }

    // Create test products
    const electronicsCategory = await AppDataSource.manager.findOne(Category, {
      where: { name: 'Electronics' },
    });

    if (electronicsCategory) {
      const productsData = [
        {
          name: 'Laptop',
          slug: 'laptop',
          priceMinor: 2500000, // 25,000 TRY
          currency: 'TRY',
          stock_qty: 10,
        },
        {
          name: 'Smartphone',
          slug: 'smartphone',
          priceMinor: 1500000, // 15,000 TRY
          currency: 'TRY',
          stock_qty: 20,
        },
      ];

      for (const prodData of productsData) {
        const existing = await AppDataSource.manager.findOne(Product, {
          where: { name: prodData.name },
        });
        if (!existing) {
          const product = new Product();
          product.name = prodData.name;
          product.slug = prodData.slug;
          product.priceMinor = prodData.priceMinor;
          product.currency = prodData.currency;
          product.stock_qty = prodData.stock_qty;
          product.category = electronicsCategory;
          await AppDataSource.manager.save(product);
          console.log(`✅ Created product: ${product.name}`);
        }
      }
    }

    // Create test session in Redis
    const sessionData = {
      userId: TEST_USER_ID,
      email: 'test@example.com',
      role: 'user',
      createdAt: Date.now(),
    };

    await redisClient.setEx(
      `session:${TEST_SESSION_TOKEN}`,
      86400, // 24 hours
      JSON.stringify(sessionData)
    );
    console.log('✅ Created test session token');
    console.log(`   Token: ${TEST_SESSION_TOKEN}`);

    console.log('\n🎉 Test data seeding completed successfully!');
    console.log('\n📝 Use this session token for k6 tests:');
    console.log(`   SESSION_TOKEN=${TEST_SESSION_TOKEN}`);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    await redisClient.quit();
    process.exit(0);
  }
}

seedTestData();
