const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {

    beforeEach(async () => { server = require('../../app'); await server.close(); server = require('../../app'); jest.setTimeout(300000) });
    
    afterEach(async () => { 
        await server.close(); 
        await Genre.remove({}) 
    });

    describe('GET', () => {

        it('should return all the genres', async() => {

            const result = await Genre.insertMany([
                { name: 'Genre1' },
                { name: 'Genre2' },
                { name: 'Genre3' }
            ]);

            const res = await request(server).get('/api/genre');
            expect(res.status).toBe(200);
            // expect(res.body.length).toBe(3);
            expect(res.body.some((genre) => genre.name === 'Genre1')).toBeTruthy();

        });
  
    });
    
    describe('GET /:id', () => {
        it('should return a genre for a valid genre object Id', async () => {

            const genreObject = { name: 'testGenre1' };
            const genre = new Genre(genreObject);
            const result = await genre.save();
            console.log(result);
            const res = await request(server).get(`/api/genre/`+genre._id);
            console.log('res.body: ',res.body);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genreObject.name);

        });

        it('should return 404 for an invalid genre object Id', async () => {

            let objectId = 1;
            // const objectId = mongoose.Types.ObjectId();
            // const genre = new Genre(genreObject);
            // const result = await genre.save();
            // console.log(result);
            const res = await request(server).get(`/api/genre/`+objectId);
            console.log('res.body: ',res.body);
            expect(res.status).toBe(404);
            // expect(res.body).toHaveProperty('name', genreObject.name);

        });
    });

    describe('POST /', () => {
        let name;
        let token;

        const execute = async () => {
            return await request(server)
            .post('/api/genre')
            .set('x-auth-token', token)
            .send({ name });
        }

        beforeEach(() => {
            name = 'genre1';
            token = new User().generateAuthToken();
        });

        it('should return 401 if no token is sent in the request', async () => {
            token='';
            const res = await execute();
            expect(res.status).toBe(401);
        });

        it('should return error code 400 if name is absent or less than 3 characters long.', async () => {
            name = '12';
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it('should return the record if the request contains token and name is more than 3 characters long.', async () => {

            const res = await execute();
            expect(res.status).toBe(200);
            expect(res.body.name).toEqual(name);

        });

        it('should return 400 status code if request contains token and name is more than 50 characters long.', async () => {

            name = new Array(52).join('a');
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it('should return the genre in body of the response.', async () => {
            
            const res = await execute()
            expect(res.status).toBe(200);
            expect(res.body.name).toEqual(name);
            expect(res.body).toHaveProperty('_id');
        });

        it('should save the genre in DB if it is valid.', async () => {
            await execute();
            const genre = await Genre.findOne({ name: name });
            expect(genre.name).toEqual(name);
        });
    });
});