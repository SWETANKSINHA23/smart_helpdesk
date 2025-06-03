const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Article = require('./models/Article');
const Ticket = require('./models/Ticket');
const dotenv = require('dotenv');

dotenv.config();


const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Article.deleteMany({});
        await Ticket.deleteMany({});

        // Seed users
        const password_hash = await bcrypt.hash('password123', 10);
        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@test.com', password_hash, role: 'admin' },
            { name: 'Agent Smith', email: 'agent@test.com', password_hash, role: 'agent' },
            { name: 'Normal User', email: 'user@test.com', password_hash, role: 'user' },
        ]);

        // Seed articles
        await Article.insertMany([
            { title: "How to update payment method", body: "...", tags: ["billing", "payments"], status: "published" },
            { title: "Troubleshooting 500 errors", body: "...", tags: ["tech", "errors"], status: "published" },
            { title: "Tracking your shipment", body: "...", tags: ["shipping", "delivery"], status: "published" }
        ]);

        // Seed tickets
        await Ticket.insertMany([
            { title: "Refund for double charge", description: "I was charged twice for order #1234", category: "other", createdBy: users[2]._id },
            { title: "App shows 500 on login", description: "Stack trace mentions auth module", category: "other", createdBy: users[2]._id },
            { title: "Where is my package?", description: "Shipment delayed 5 days", category: "other", createdBy: users[2]._id }
        ]);

        console.log('Database seeded successfully!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Database seeding failed:', error);
        mongoose.disconnect();
        process.exit(1);
    }
};

seedDB();