const db = require('./db');

// Seed data for Florecer platform
const seedProducts = [
  {
    nombre: "Crema Hidratante Natural",
    descripcion: "Crema hidratante con ingredientes naturales para todo tipo de piel",
    precio: 25.99,
    imagen_url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
    categoria: "Cuidado de la Piel"
  },
  {
    nombre: "Vitamina C Suplemento",
    descripcion: "Suplemento de vitamina C para fortalecer el sistema inmunológico",
    precio: 15.50,
    imagen_url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
    categoria: "Nutrición"
  },
  {
    nombre: "Champú Nutritivo",
    descripcion: "Champú enriquecido con aceites naturales para cabello saludable",
    precio: 18.75,
    imagen_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    categoria: "Cuidado del Cabello"
  },
  {
    nombre: "Serum Anti-edad",
    descripcion: "Serum facial con retinol para reducir signos de envejecimiento",
    precio: 45.00,
    imagen_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
    categoria: "Cuidado de la Piel"
  },
  {
    nombre: "Proteína Vegetal",
    descripcion: "Proteína en polvo de origen vegetal para nutrición deportiva",
    precio: 32.99,
    imagen_url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    categoria: "Nutrición"
  },
  {
    nombre: "Aceite para Cabello",
    descripcion: "Aceite natural de argán para hidratar y nutrir el cabello",
    precio: 22.50,
    imagen_url: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400",
    categoria: "Cuidado del Cabello"
  }
];

const seedData = () => {
  console.log('Seeding products...');
  
  try {
    seedProducts.forEach(product => {
      db.product.create({ data: product });
      console.log(`Added product: ${product.nombre}`);
    });
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, seedProducts };