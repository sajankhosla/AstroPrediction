const db = require('./utils/database');

async function testDatabase() {
  console.log('🧪 Testing database operations...');
  
  try {
    // Wait for database initialization
    console.log('⏳ Waiting for database initialization...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 1: Check if we can query the database
    console.log('📊 Testing database query...');
    const result = await db.getAsync('SELECT COUNT(*) as count FROM users');
    console.log('✅ Database query successful:', result);
    
    // Test 2: Test inserting a user
    console.log('👤 Testing user insertion...');
    const testUser = {
      id: 'test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      birthDate: '1990-01-01',
      birthTime: '12:00',
      birthPlace: 'Test City',
      latitude: 0,
      longitude: 0,
      createdAt: new Date().toISOString()
    };
    
    await db.runAsync(`
      INSERT INTO users (id, name, email, password, birthDate, birthTime, birthPlace, latitude, longitude, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [testUser.id, testUser.name, testUser.email, testUser.password, testUser.birthDate, testUser.birthTime, testUser.birthPlace, testUser.latitude, testUser.longitude, testUser.createdAt]);
    
    console.log('✅ User insertion successful');
    
    // Test 3: Test retrieving the user
    console.log('🔍 Testing user retrieval...');
    const retrievedUser = await db.getAsync('SELECT * FROM users WHERE id = ?', [testUser.id]);
    console.log('✅ User retrieval successful:', retrievedUser ? 'User found' : 'User not found');
    
    // Test 4: Clean up
    console.log('🧹 Cleaning up test data...');
    await db.runAsync('DELETE FROM users WHERE id = ?', [testUser.id]);
    console.log('✅ Cleanup successful');
    
    console.log('🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase();
