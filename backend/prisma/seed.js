/**
 * Database Seed Script
 * Populates the database with sample categories and vehicles
 *
 * Usage: npm run db:seed
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clear existing data (order matters due to foreign keys)
  await prisma.reservation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Sedan' } }),
    prisma.category.create({ data: { name: 'SUV' } }),
    prisma.category.create({ data: { name: 'Hatchback' } }),
    prisma.category.create({ data: { name: 'Electric' } }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  const [sedan, suv, hatchback, electric] = categories;

  // Create vehicles
  const vehicles = await Promise.all([
    // Sedans
    prisma.vehicle.create({
      data: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2024,
        pricePerDay: 75.00,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        mileage: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        available: true,
        categoryId: sedan.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: 'Honda',
        model: 'Civic',
        year: 2023,
        pricePerDay: 70.00,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        mileage: 18000,
        imageUrl: 'https://images.unsplash.com/photo-1606611013016-969c19ba27d5?w=800',
        available: true,
        categoryId: sedan.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: 'BMW',
        model: '3 Series',
        year: 2024,
        pricePerDay: 150.00,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        mileage: 8000,
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        available: true,
        categoryId: sedan.id,
      },
    }),

    // SUVs
    prisma.vehicle.create({
      data: {
        brand: 'Toyota',
        model: 'RAV4',
        year: 2024,
        pricePerDay: 110.00,
        fuelType: 'Hybrid',
        transmission: 'Automatic',
        mileage: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
        available: true,
        categoryId: suv.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: 'Jeep',
        model: 'Cherokee',
        year: 2023,
        pricePerDay: 120.00,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        mileage: 22000,
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        available: true,
        categoryId: suv.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: 'Ford',
        model: 'Kuga',
        year: 2022,
        pricePerDay: 95.00,
        fuelType: 'Diesel',
        transmission: 'Manual',
        mileage: 35000,
        imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
        available: false,
        categoryId: suv.id,
      },
    }),

    // Hatchbacks
    prisma.vehicle.create({
      data: {
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2023,
        pricePerDay: 65.00,
        fuelType: 'Gasoline',
        transmission: 'Manual',
        mileage: 20000,
        imageUrl: 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800',
        available: true,
        categoryId: hatchback.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: 'Renault',
        model: 'Clio',
        year: 2024,
        pricePerDay: 50.00,
        fuelType: 'Gasoline',
        transmission: 'Manual',
        mileage: 10000,
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0637?w=800',
        available: true,
        categoryId: hatchback.id,
      },
    }),

    // Electric
    prisma.vehicle.create({
      data: {
        brand: 'Tesla',
        model: 'Model 3',
        year: 2024,
        pricePerDay: 200.00,
        fuelType: 'Electric',
        transmission: 'Automatic',
        mileage: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        available: true,
        categoryId: electric.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: 'BMW',
        model: 'iX3',
        year: 2023,
        pricePerDay: 180.00,
        fuelType: 'Electric',
        transmission: 'Automatic',
        mileage: 12000,
        imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
        available: true,
        categoryId: electric.id,
      },
    }),
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);
  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
