const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
  // FOOTWEAR - 15 products
  { name: "Nike Air Max 270", category: "Footwear", price: 159.99, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", description: "Men's running shoes" },
  { name: "Adidas Ultraboost 22", category: "Footwear", price: 189.99, imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", description: "Running shoes" },
  { name: "Vans Old Skool", category: "Footwear", price: 65.00, imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400", description: "Classic skate shoes" },
  { name: "Converse Chuck Taylor", category: "Footwear", price: 55.00, imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400", description: "Canvas high tops" },
  { name: "Puma RS-X", category: "Footwear", price: 110.00, imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", description: "Chunky sneakers" },
  { name: "New Balance 574", category: "Footwear", price: 84.99, imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", description: "Classic running shoes" },
  { name: "Reebok Classic", category: "Footwear", price: 75.00, imageUrl: "https://images.unsplash.com/photo-1605348532760-5703dab5be93?w=400", description: "Retro sneakers" },
  { name: "Timberland Boots", category: "Footwear", price: 198.00, imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b2829c?w=400", description: "Waterproof boots" },
  { name: "Dr. Martens 1460", category: "Footwear", price: 170.00, imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b2829c?w=400", description: "Combat boots" },
  { name: "Hoka Clifton 9", category: "Footwear", price: 145.00, imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", description: "Cushioned running shoes" },
  { name: "ASICS Gel-Kayano", category: "Footwear", price: 160.00, imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", description: "Stability running shoes" },
  { name: "Brooks Ghost 15", category: "Footwear", price: 140.00, imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", description: "Neutral running shoes" },
  { name: "Saucony Triumph", category: "Footwear", price: 150.00, imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", description: "Cushioned running shoes" },
  { name: "Under Armour HOVR", category: "Footwear", price: 120.00, imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", description: "Running shoes" },
  { name: "Fila Disruptor", category: "Footwear", price: 75.00, imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", description: "Chunky sneakers" },

  // WATCHES - 10 products
  { name: "Rolex Submariner", category: "Watches", price: 8500.00, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", description: "Luxury diving watch" },
  { name: "Apple Watch Series 8", category: "Watches", price: 399.00, imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400", description: "Smart watch" },
  { name: "Casio G-Shock", category: "Watches", price: 120.00, imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400", description: "Digital watch" },
  { name: "Tag Heuer Carrera", category: "Watches", price: 4500.00, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", description: "Chronograph watch" },
  { name: "Omega Seamaster", category: "Watches", price: 5200.00, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", description: "Diving watch" },
  { name: "Fossil Gen 6", category: "Watches", price: 299.00, imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400", description: "Hybrid smartwatch" },
  { name: "Seiko 5", category: "Watches", price: 250.00, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", description: "Automatic watch" },
  { name: "Citizen Eco-Drive", category: "Watches", price: 350.00, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", description: "Solar powered watch" },
  { name: "Garmin Fenix 7", category: "Watches", price: 699.00, imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400", description: "GPS sports watch" },
  { name: "Fitbit Sense 2", category: "Watches", price: 299.00, imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400", description: "Fitness tracker" },

  // CLOTHING - 15 products
  { name: "Levi's 501 Jeans", category: "Clothing", price: 89.99, imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", description: "Classic jeans" },
  { name: "The North Face Jacket", category: "Clothing", price: 249.99, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", description: "Waterproof jacket" },
  { name: "Zara Basic T-Shirt", category: "Clothing", price: 29.99, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", description: "Cotton t-shirt" },
  { name: "Gap Hoodie", category: "Clothing", price: 59.99, imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400", description: "Cotton hoodie" },
  { name: "H&M Sweater", category: "Clothing", price: 39.99, imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400", description: "Knit sweater" },
  { name: "Uniqlo Pants", category: "Clothing", price: 49.90, imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", description: "Casual pants" },
  { name: "Patagonia Vest", category: "Clothing", price: 129.00, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", description: "Fleece vest" },
  { name: "Columbia Fleece", category: "Clothing", price: 85.00, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", description: "Fleece jacket" },
  { name: "Ralph Lauren Polo", category: "Clothing", price: 98.50, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", description: "Polo shirt" },
  { name: "Tommy Hilfiger Shirt", category: "Clothing", price: 79.99, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", description: "Oxford shirt" },
  { name: "Adidas Tracksuit", category: "Clothing", price: 89.99, imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400", description: "Sports tracksuit" },
  { name: "Nike Dri-FIT", category: "Clothing", price: 35.00, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", description: "Performance shirt" },
  { name: "Under Armour Leggings", category: "Clothing", price: 55.00, imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400", description: "Training leggings" },
  { name: "Lululemon Pants", category: "Clothing", price: 98.00, imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", description: "Yoga pants" },
  { name: "Calvin Klein Underwear", category: "Clothing", price: 24.99, imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400", description: "Cotton underwear" },

  // ELECTRONICS - 10 products
  { name: "iPhone 15 Pro", category: "Electronics", price: 999.00, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", description: "Smartphone" },
  { name: "Samsung S24 Ultra", category: "Electronics", price: 1199.00, imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", description: "Android phone" },
  { name: "MacBook Pro", category: "Electronics", price: 1999.00, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", description: "Laptop" },
  { name: "Sony Headphones", category: "Electronics", price: 299.00, imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400", description: "Noise cancelling" },
  { name: "iPad Air", category: "Electronics", price: 599.00, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", description: "Tablet" },
  { name: "Dell XPS 15", category: "Electronics", price: 1499.00, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", description: "Windows laptop" },
  { name: "Bose Speaker", category: "Electronics", price: 279.00, imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", description: "Bluetooth speaker" },
  { name: "Canon Camera", category: "Electronics", price: 899.00, imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400", description: "DSLR camera" },
  { name: "Kindle Paperwhite", category: "Electronics", price: 139.00, imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", description: "E-reader" },
  { name: "PlayStation 5", category: "Electronics", price: 499.00, imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400", description: "Gaming console" },

  // ACCESSORIES - 10 products
  { name: "Ray-Ban Aviator", category: "Accessories", price: 153.00, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", description: "Sunglasses" },
  { name: "Herschel Backpack", category: "Accessories", price: 59.99, imageUrl: "https://images.unsplash.com/photo-1581606970644-3c6e6b3b4b4b?w=400", description: "Canvas backpack" },
  { name: "Gucci Belt", category: "Accessories", price: 450.00, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", description: "Leather belt" },
  { name: "Oakley Sunglasses", category: "Accessories", price: 120.00, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", description: "Sport sunglasses" },
  { name: "Fossil Wallet", category: "Accessories", price: 45.00, imageUrl: "https://images.unsplash.com/photo-1627123424574-7247585940ea?w=400", description: "Leather wallet" },
  { name: "SwissGear Luggage", category: "Accessories", price: 199.00, imageUrl: "https://images.unsplash.com/photo-1581606970644-3c6e6b3b4b4b?w=400", description: "Suitcase" },
  { name: "Michael Kors Handbag", category: "Accessories", price: 298.00, imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400", description: "Designer handbag" },
  { name: "Tumi Briefcase", category: "Accessories", price: 595.00, imageUrl: "https://images.unsplash.com/photo-1581606970644-3c6e6b3b4b4b?w=400", description: "Leather briefcase" },
  { name: "Prada Sunglasses", category: "Accessories", price: 320.00, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", description: "Designer sunglasses" },
  { name: "Nike Cap", category: "Accessories", price: 25.00, imageUrl: "https://images.unsplash.com/photo-1588850567225-5e5f5b8b8b8b?w=400", description: "Baseball cap" }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`✅ Added ${result.length} products to database`);
    
    // Show category counts
    const counts = {};
    result.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
    console.log('\n📊 Products by category:', counts);
    
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();