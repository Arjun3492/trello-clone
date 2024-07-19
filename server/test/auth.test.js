const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authRoutes = require('../routes/auth');
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

let mongoServer;
let testUser;

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('testpassword', salt);
    testUser = new User({ name: 'Test User', email: 'test@example.com', password: hashedPassword });
    await testUser.save();
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auth API', () => {
    it('should register a user', (done) => {
        request(app)
            .post('/api/auth/register')
            .send({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'newpassword'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not register a user with existing email', (done) => {
        request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'testpassword'
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('msg', 'User already exists');
                done();
            });
    });

    it('should login a user', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'testpassword'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not login with incorrect password', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('msg', 'Invalid Credentials');
                done();
            });
    });
});
