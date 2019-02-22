const request = require('supertest');
const { User } = require('../../models/user');
let server;

describe('auth middleware', () => {

    let token;
    let name;
    
    beforeEach(async () => { 
        server = require('../../app');
        await server.close();
        server = require('../../app');
        token = new User().generateAuthToken();
        name = 'genre1';
    });

    afterEach(async () => await server.close());

    const execute = () => {
        return request(server)
            .post('/api/genre')
            .set('x-auth-token', token)
            .send({ name })
    }

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await execute();
        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token is provided', async () => {
        token = '1';
        const res = await execute();
        expect(res.status).toBe(400);
    });

    it('should return 400 if name is less than 3 characters', async () => {
        name = '12';
        const res = await execute();
        expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 50 characters', async () => {
        name = new Array(52).join('a');
        const res = await execute();
        expect(res.status).toBe(400);
    });

});