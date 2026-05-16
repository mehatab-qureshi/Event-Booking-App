const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify')
    .then(async () => {
        console.log('MongoDB Connected');

        // ✅ Auto seed if DB is empty
        const User = require('./models/User');
        const count = await User.countDocuments();
        if (count === 0) {
            console.log('Empty DB detected, seeding...');
            const { seedDatabase } = require('./seed');
            await seedDatabase();
            console.log('✅ Seed complete!');
        } else {
            console.log(`✅ DB already has data (${count} users), skipping seed.`);
        }
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));