import { config } from 'dotenv';
config({ path: '.env.local' });

// We must import these AFTER dotenv has loaded the variables
import { db, client } from './index';
import { products, builderOptions } from './schema';

const expressProducts = [
    {
        name: "Standard Red Romance",
        description: "Buket bunga mawar merah klasik untuk momen romantis.",
        priceAffordable: 50000,
        priceStandard: 100000,
        pricePremium: 150000,
        priceSpecial: 250000,
        allowAffordable: true,
        allowStandard: true,
        allowPremium: true,
        allowSpecial: false,
        imageUrl: "/images/red-romance.png",
        stock: 5,
        status: true,
    },
    {
        name: "Mini Forest Bloom",
        description: "Nuansa hangat hutan dengan sentuhan warna bumi.",
        priceAffordable: 75000,
        priceStandard: 125000,
        pricePremium: 175000,
        priceSpecial: 300000,
        allowAffordable: true,
        allowStandard: true,
        allowPremium: true,
        allowSpecial: true,
        imageUrl: "/images/forest-bloom.png",
        stock: 8,
        status: true,
    },
    {
        name: "Standard Pastel Dream",
        description: "Kombinasi elegan warna pastel yang menenangkan hati.",
        priceAffordable: 60000,
        priceStandard: 100000,
        pricePremium: 140000,
        priceSpecial: 200000,
        allowAffordable: true,
        allowStandard: true,
        allowPremium: true,
        allowSpecial: false,
        imageUrl: "/images/pastel-dream.png",
        stock: 4,
        status: true,
    },
    {
        name: "Premium Eternal Soft",
        description: "Hydrangea lembut yang awet sepanjang masa.",
        priceAffordable: 80000,
        priceStandard: 150000,
        pricePremium: 220000,
        priceSpecial: 400000,
        allowAffordable: true,
        allowStandard: true,
        allowPremium: true,
        allowSpecial: true,
        imageUrl: "/images/soft-hydrangea.png",
        stock: 3,
        status: true,
    },
    {
        name: "Premium Elegance Hampers",
        description: "Tulip beludru premium dalam kemasan elegan.",
        priceAffordable: 100000,
        priceStandard: 200000,
        pricePremium: 300000,
        priceSpecial: 500000,
        allowAffordable: true,
        allowStandard: true,
        allowPremium: true,
        allowSpecial: true,
        imageUrl: "/images/tulip-velvet.png",
        stock: 2,
        status: true,
    },
    {
        name: "Mini Sunset Glow",
        description: "Pancaran warna jingga matahari terbenam yang romantis.",
        priceAffordable: 75000,
        priceStandard: 125000,
        pricePremium: 180000,
        priceSpecial: 275000,
        allowAffordable: true,
        allowStandard: true,
        allowPremium: true,
        allowSpecial: false,
        imageUrl: "/images/sunset-glow.png",
        stock: 6,
        status: true,
    },
];

const customOptions = [
    // Flowers
    { category: "flower", name: "mawar", isAvailable: true, priceAdjustment: 0 },
    { category: "flower", name: "tulip", isAvailable: true, priceAdjustment: 20000 },
    { category: "flower", name: "hydrangea", isAvailable: true, priceAdjustment: 35000 },
    { category: "flower", name: "lily", isAvailable: true, priceAdjustment: 15000 },
    { category: "flower", name: "daisy", isAvailable: true, priceAdjustment: -10000 },

    // Colors
    { category: "color", name: "merah", isAvailable: true, priceAdjustment: 0 },
    { category: "color", name: "pink", isAvailable: true, priceAdjustment: 0 },
    { category: "color", name: "putih", isAvailable: true, priceAdjustment: 5000 },
    { category: "color", name: "kuning", isAvailable: true, priceAdjustment: 0 },
    { category: "color", name: "ungu", isAvailable: true, priceAdjustment: 10000 },

    // Wrappers
    { category: "wrapper", name: "kraft", isAvailable: true, priceAdjustment: 0 },
    { category: "wrapper", name: "satin", isAvailable: true, priceAdjustment: 15000 },
    { category: "wrapper", name: "organza", isAvailable: true, priceAdjustment: 25000 },
    { category: "wrapper", name: "burlap", isAvailable: true, priceAdjustment: 10000 },
];

async function main() {
    console.log("🌱 Seeding database...");

    try {
        // Clear existing products to avoid conflicts with old schema during seed re-run
        console.log("Cleaning up existing products...");
        await db.delete(products);

        // 1. Seed Products
        console.log("Inserting Express Products...");
        for (const product of expressProducts) {
            await db.insert(products).values(product);
        }
        console.log("✅ Express Products seeded!");

        // 2. Seed Builder Options
        // (Optional: clear builderOptions too if needed)

        console.log("Inserting Builder Options...");
        for (const option of customOptions) {
            await db.insert(builderOptions).values(option).onConflictDoNothing();
        }
        console.log("✅ Builder Options seeded!");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    } finally {
        console.log("🏁 Closing database connection...");
        await client.end();
        console.log("👋 Seeding complete!");
    }
}

main();
