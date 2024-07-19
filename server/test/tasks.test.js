const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');
const taskRoutes = require('../routes/tasks');
const auth = require('../middlewares/auth');
const app = express();

app.use(express.json());
app.use('/api/tasks', taskRoutes);

let mongoServer;
let testUser;
let token;

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user
    testUser = new User({ name: 'Test User', email: 'test@example.com', password: 'testpassword' });
    await testUser.save();

    // Create a JWT token
    const payload = { user: { id: testUser.id } };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Tasks API', () => {
    it('should create a task', (done) => {
        request(app)
            .post('/api/tasks')
            .set('x-auth-token', token)
            .send({
                title: 'Test Task',
                column: 'To Do'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('title', 'Test Task');
                done();
            });
    });

    it('should get all tasks for the user', (done) => {
        request(app)
            .get('/api/tasks')
            .set('x-auth-token', token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should update a task', (done) => {
        const task = new Task({ title: 'Update Task', column: 'To Do', user: testUser.id });
        task.save().then(savedTask => {
            request(app)
                .put(`/api/tasks/${savedTask.id}`)
                .set('x-auth-token', token)
                .send({ title: 'Updated Task' })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('title', 'Updated Task');
                    done();
                });
        });
    });

    it('should delete a task', (done) => {
        const task = new Task({ title: 'Delete Task', column: 'To Do', user: testUser.id });
        task.save().then(savedTask => {
            request(app)
                .delete(`/api/tasks/${savedTask.id}`)
                .set('x-auth-token', token)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('msg', 'Task removed');
                    done();
                });
        });
    });
});
