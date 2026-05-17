const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@eventify.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventify.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventify.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventify.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventify.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventify.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@eventify.com', password: 'password123', role: 'user' },
    { name: 'Fiona Gallagher', email: 'fiona@eventify.com', password: 'password123', role: 'user' },
    { name: 'George Miller', email: 'george@eventify.com', password: 'password123', role: 'user' },
    { name: 'Hannah Montana', email: 'hannah@eventify.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'CodeStorm Hackathon 2026',
        description: 'Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Bangalore Tech Hub',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
    },
    {
        title: 'Laugh Riot Night',
        description: 'A night full of comedy performances by popular stand-up comedians.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Mumbai Comedy Show',
        category: 'Entertainment',
        totalSeats: 120,
        ticketPrice: 400,
        image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260'
    },
    {
        title: 'Career Guidance Seminar 2026',
        description: 'Guidance session for students and professionals on career planning and opportunities.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Delhi Convention Center',
        category: 'Education',
        totalSeats: 250,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d'
    },
    {
        title: 'Ultimate Fitness Challenge',
        description: 'Test your strength and endurance in fitness challenges and win cash price.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'City Gym Arena',
        category: 'Fitness',
        totalSeats: 50,
        ticketPrice: 200,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438'
    },
    {
        title: 'Investor Roundtable',
        description: 'Exclusive meetup between startups and angel investors',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Mumbai Finance Center',
        category: 'Networking',
        totalSeats: 60,
        ticketPrice: 1000,
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43'
    },
    {
        title: 'AI & ML Workshop',
        description: 'Hands-on workshop covering machine learning, AI models, and real-world projects.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'IIT Campus Workshop Hall',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 300,
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb'
    }
];


const seedDatabase = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️  Cleared existing data.');

        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');
        console.log(`👤 Created ${createdUsers.length} users.`);

        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 Created ${createdEvents.length} events.`);

        const bookingsData = [];
        for (const event of createdEvents) {
            const randomCount = Math.floor(Math.random() * 4) + 3;
            const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, randomCount);

            for (const user of selectedUsers) {
                const statuses = ['pending', 'confirmed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                let paymentStatus = 'not_paid';
                if (status === 'confirmed' && event.ticketPrice > 0) {
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'not_paid';
                } else if (event.ticketPrice === 0) {
                    paymentStatus = 'paid';
                }
                bookingsData.push({
                    userId: user._id,
                    eventId: event._id,
                    status,
                    paymentStatus,
                    amount: event.ticketPrice
                });
                if (status === 'confirmed') {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookingsData);
        console.log(`🎫 Inserted ${bookingsData.length} bookings.`);
        console.log('🚀 Database seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding:', error);
    }
};


module.exports = { seedDatabase };