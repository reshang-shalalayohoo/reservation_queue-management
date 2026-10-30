const bcrypt = require('bcryptjs');
const pool = require('./config/db');
require('dotenv').config();

async function seed() {
  try {
    console.log('🌱 Seeding Viking Grill database...\n');

    // Hash default password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);

    // ========== USERS ==========
    console.log('  → Creating users...');
    const users = [
      ['John Customer', 'customer@viking.com', '09171234567', hash, 'customer'],
      ['Maria Santos', 'maria@viking.com', '09181234567', hash, 'customer'],
      ['Jane Staff', 'staff@viking.com', '09191234567', hash, 'reservation_staff'],
      ['Chef Mike', 'kitchen@viking.com', '09201234567', hash, 'kitchen_staff'],
      ['Admin Viking', 'admin@viking.com', '09211234567', hash, 'management'],
    ];

    for (const u of users) {
      await pool.query(
        `INSERT IGNORE INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
        u
      );
    }

    // ========== TABLES ==========
    console.log('  → Creating restaurant tables...');
    const tables = [
      ['M1', 2, 'main'],
      ['M2', 2, 'main'],
      ['M3', 4, 'main'],
      ['M4', 4, 'main'],
      ['M5', 6, 'main'],
      ['M6', 8, 'main'],
      ['B1', 4, 'bar'],
      ['B2', 4, 'bar'],
      ['B3', 2, 'bar'],
      ['P1', 4, 'billiards'],
      ['P2', 6, 'billiards'],
      ['K1', 8, 'ktv'],
      ['K2', 10, 'ktv'],
      ['K3', 6, 'ktv'],
    ];

    for (const t of tables) {
      await pool.query(
        `INSERT IGNORE INTO restaurant_tables (table_number, capacity, area) VALUES (?, ?, ?)`,
        t
      );
    }

    // ========== MENU ITEMS ==========
    console.log('  → Creating menu items...');
    const menuItems = [
      ['Viking Warrior Steak', 'Premium 12oz ribeye grilled to perfection, served with garlic butter and roasted vegetables.', 580.00, 'grill', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'],
      ['Smoked BBQ Ribs', 'Slow-smoked pork ribs glazed with our signature BBQ sauce. Fall-off-the-bone tender.', 520.00, 'grill', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'],
      ['Grilled Norwegian Salmon', 'Fresh salmon fillet grilled with lemon herb butter, served with asparagus and rice.', 480.00, 'grill', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop'],
      ['Viking Burger', 'Double smash patty with aged cheddar, caramelized onions, bacon, and Viking sauce.', 350.00, 'grill', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'],
      ['Grilled Chicken Platter', 'Herb-marinated chicken thighs and breast, served with coleslaw and fries.', 320.00, 'main_course', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop'],
      ['Seafood Pasta', 'Creamy garlic pasta with shrimp, mussels, and calamari in white wine sauce.', 420.00, 'main_course', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop'],
      ['Buffalo Wings', 'Crispy chicken wings tossed in spicy buffalo sauce. Served with blue cheese dip.', 280.00, 'appetizer', 'https://images.unsplash.com/photo-1608039829572-9c8ee6c2dee3?w=400&h=300&fit=crop'],
      ['Loaded Nachos', 'Tortilla chips loaded with cheese, jalapeños, ground beef, sour cream, and salsa.', 260.00, 'appetizer', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop'],
      ['Mozzarella Sticks', 'Golden fried mozzarella sticks with marinara dipping sauce.', 220.00, 'appetizer', 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop'],
      ['Caesar Salad', 'Crisp romaine lettuce, parmesan, croutons, and creamy Caesar dressing.', 200.00, 'appetizer', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'],
      ['Classic Mojito', 'Fresh mint, lime, white rum, sugar, and soda water over crushed ice.', 180.00, 'beverage', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop'],
      ['Craft Beer Flight', 'Selection of four local craft beers served in tasting glasses.', 320.00, 'beverage', 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop'],
      ['Viking Mead', 'Traditional honey wine served chilled. Sweet and refreshing.', 220.00, 'beverage', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop'],
      ['Iced Tea', 'House-brewed iced tea with lemon. Regular or honey-flavored.', 80.00, 'beverage', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'],
      ['Chocolate Lava Cake', 'Warm chocolate cake with a molten center, served with vanilla ice cream.', 250.00, 'dessert', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop'],
      ['New York Cheesecake', 'Creamy classic cheesecake with graham cracker crust and berry compote.', 220.00, 'dessert', 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400&h=300&fit=crop'],
      ['Truffle Fries', 'Crispy fries tossed with truffle oil, parmesan, and fresh herbs.', 180.00, 'bar_snack', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop'],
      ['Onion Rings', 'Beer-battered onion rings served with chipotle mayo.', 160.00, 'bar_snack', 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop'],
    ];

    for (const m of menuItems) {
      await pool.query(
        `INSERT IGNORE INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)`,
        m
      );
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('   Customer:          customer@viking.com / password123');
    console.log('   Customer 2:        maria@viking.com / password123');
    console.log('   Reservation Staff: staff@viking.com / password123');
    console.log('   Kitchen Staff:     kitchen@viking.com / password123');
    console.log('   Management:        admin@viking.com / password123\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
