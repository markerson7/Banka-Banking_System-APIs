// Developed by: Markerson D Flomo, Reg No: 20724/2022

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000, 
  });

  console.log('MongoDB Memory Server connected');
});


afterAll(async () => {
    try {
      console.log('Closing MongoDB connection...');
      
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
      }
  
      if (mongoServer) {
        await mongoServer.stop();
      }
  
      console.log('MongoDB Memory Server stopped');
    } catch (error) {
      console.error('Error shutting down MongoDB:', error);
    }
  });
  
