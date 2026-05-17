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

        const User = require('./models/User');
        const Event = require('./models/Event');

        const userCount = await User.countDocuments();
        const eventCount = await Event.countDocuments();

        if (userCount === 0) {
            // DB bilkul empty hai - full seed
            console.log('Empty DB, full seeding...');
            const { seedDatabase } = require('./seed');
            await seedDatabase();
            console.log('✅ Full seed complete!');
        } else if (eventCount === 0) {
            // Sirf events delete hue - sirf events seed karo
            console.log('No events found, seeding events only...');
            const { events } = require('./seed');
            const adminUser = await User.findOne({ role: 'admin' });
            const eventsWithAdmin = events.map(e => ({
                ...e,
                availableSeats: e.totalSeats,
                createdBy: adminUser._id
            }));
            await Event.insertMany(eventsWithAdmin);
            console.log('✅ Events seeded!');
        } else {
            console.log(`✅ DB has data (${userCount} users, ${eventCount} events), skipping seed.`);
        }
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));