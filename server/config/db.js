// Shared in-memory data store replacing MongoDB
export const users = [];
export const chats = [];

const connectDB = async () => {
  console.log('--------------------------------------------------');
  console.log('Database Mode: IN-MEMORY (No MongoDB required!)');
  console.log('Data will persist for the duration of the server process.');
  console.log('--------------------------------------------------');
};

export default connectDB;
