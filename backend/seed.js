const db = require("./db");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const path = require("path");

// Get raw database access for special operations
const rawDb = new Database(path.join(__dirname, "prisma", "dev.db"));

// Seed initial data for Florecer MVP
async function seedData() {
  console.log("Starting database seeding...");

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);

    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@florecer.com" },
    });

    if (!existingAdmin) {
      await db.user.create({
        email: "admin@florecer.com",
        username: "admin",
        password: adminPassword,
        rol: "admin",
      });

      console.log("✅ Admin user created: admin@florecer.com / admin123");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Create sample products
    const products = [
      {
        nombre: "Serum Vitamina C",
        descripcion:
          "Potente serum antioxidante con vitamina C para iluminar y proteger la piel",
        precio: 45.99,
        imagen_url:
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",
        categoria: "skincare",
      },
      {
        nombre: "Crema Hidratante Facial",
        descripcion:
          "Crema hidratante ligera con ácido hialurónico para todo tipo de piel",
        precio: 32.5,
        imagen_url:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        categoria: "skincare",
      },
      {
        nombre: "Aceite de Argan Puro",
        descripcion: "Aceite natural de argan 100% puro para cabello y piel",
        precio: 28.75,
        imagen_url:
          "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
        categoria: "hair",
      },
      {
        nombre: "Mascarilla Purificante",
        descripcion:
          "Mascarilla de arcilla verde para purificar y desintoxicar la piel",
        precio: 18.99,
        imagen_url:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
        categoria: "skincare",
      },
      {
        nombre: "Champú Nutritivo",
        descripcion: "Champú sin sulfatos enriquecido con aceites naturales",
        precio: 24.0,
        imagen_url:
          "https://images.unsplash.com/photo-1574017411378-f1ddc1b8d0f6?w=400&h=400&fit=crop",
        categoria: "hair",
      },
      {
        nombre: "Protector Solar SPF 50",
        descripcion: "Protector solar facial no graso con protección UVA/UVB",
        precio: 38.5,
        imagen_url:
          "https://images.unsplash.com/photo-1556229010-aa0134e2881a?w=400&h=400&fit=crop",
        categoria: "skincare",
      },
    ];

    // Check if products already exist
    const existingProducts = db.product.findMany({});

    if (existingProducts.length === 0) {
      products.forEach((product) => {
        db.product.create({ data: product });
      });
      console.log(`✅ ${products.length} sample products created`);
    } else {
      console.log("✅ Products already exist");
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

// Run seeding
if (require.main === module) {
  seedData();
}

module.exports = { seedData };
