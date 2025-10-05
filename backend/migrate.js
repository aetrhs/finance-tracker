const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

const renameField = async () => {
    try {
        console.log('Connecting to MongoDB...');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected. Starting migration...');

        const collection = mongoose.connection.db.collection('transactions');

        const count = await collection.countDocuments({ text: { $exists: true } });
        console.log(`Found ${count} documents with the old 'text' field.`);
        
        if (count === 0) {
            console.log('No migration needed. Exiting.');
            await mongoose.disconnect();
            return;
        }

        const result = await collection.updateMany(
            { text: { $exists: true } },
            { $rename: { 'text': 'description' } }
        );

        console.log(`Migration complete: ${result.modifiedCount} documents updated.`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

renameField();