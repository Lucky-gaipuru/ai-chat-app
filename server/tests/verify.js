import bcrypt from 'bcryptjs';
import { users, chats } from '../config/db.js';

const runTests = async () => {
  console.log('--- STARTING IN-MEMORY DB & CONTROLLER TEST ---');
  
  try {
    // 1. Test registration mockup logic
    console.log('Testing in-memory registration logic...');
    const testUsername = 'tester';
    const testEmail = 'tester@example.com';
    const testPassword = 'password123';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);

    const newUser = {
      _id: 'test-user-id-999',
      username: testUsername,
      email: testEmail,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);
    console.log('✓ Mock user registered in-memory!');
    console.log(`Users count: ${users.length}`);

    // 2. Test login lookup
    console.log('Testing password verification...');
    const foundUser = users.find(u => u.email === testEmail);
    if (!foundUser) {
      throw new Error('Could not find registered user by email');
    }

    const isMatch = await bcrypt.compare(testPassword, foundUser.password);
    if (!isMatch) {
      throw new Error('Password verification failed for hashed password');
    }
    console.log('✓ Password matching succeeds!');

    // 3. Test chat creation mockup logic
    console.log('Testing in-memory chat structure...');
    const newChat = {
      _id: 'test-chat-id-888',
      userId: foundUser._id,
      title: 'Mock conversation title',
      messages: [
        { _id: 'msg-1', role: 'user', content: 'Hello AI' },
        { _id: 'msg-2', role: 'assistant', content: 'Hello user!' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    chats.push(newChat);
    console.log('✓ Mock chat added in-memory!');
    console.log(`Chats count: ${chats.length}`);

    const foundChat = chats.find(c => c._id === 'test-chat-id-888');
    if (!foundChat || foundChat.messages.length !== 2) {
      throw new Error('Could not load chat data from memory list');
    }
    console.log('✓ Chat history reads successfully!');

    // Cleanup
    users.length = 0;
    chats.length = 0;
    console.log('✓ In-memory DB cleaned up.');

    console.log('--- ALL IN-MEMORY LOGIC TESTS PASSED SUCCESSFULLY ---');
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
};

runTests();
