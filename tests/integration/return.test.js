const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');
const moment = require('moment');


describe('/api/return', () => {

    let server;
    let token;
    let customerId;
    let movieId;
    let rental;
    let movie;

    const execute = async () => {
        return await request(server)
        .post('/api/return')
        .set('x-auth-token', token)
        .send({ customerId, movieId })
    }

    beforeEach(async () => { 

        server = require('../../app');
        await server.close();
        server = require('../../app');  
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: new Genre({
                name: '12345'
            }),
            dailyRentalRate: 2,
            numberInStock: 10
        });

        await movie.save();
        await rental.save(); 

        jest.setTimeout(30000);
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    // it('should save the rental in the DB.', async () => {
    //     const result = await Rental.findById(rental._id);
    //     expect(result).not.toBeNull();
    // });

    it('should return 401 error if the client is not logged in.', async () => {
        const res = await request(server).post('/api/return');

        expect(res.status).toBe(401);
    });

    it('should return 401 error if the client is not logged in.', async () => {
        const res = await request(server).post('/api/return');

        expect(res.status).toBe(401);
    });

    it('should return 400 error if the customer Id is not provided.', async () => {
        customerId='';
        const res = await execute();

        expect(res.status).toBe(400);
    });

    it('should return 400 error if the movie Id is not provided.', async () => {
        movieId = '';
        const res = await execute();

        expect(res.status).toBe(400);
    });

    it('should return 404 error if no rental found for this movie.', async () => {
        await Rental.remove({});
        const res = await execute();

        expect(res.status).toBe(404);
    });

    it('should return 400 error if rental already processed.', async () => {
        rental.dateReturned = Date.now();
        await rental.save();
        const res = await execute();

        expect(res.status).toBe(400);
    });

    it('should return 200 if rental request is valid.', async () => {
        const res = await execute();

        expect(res.status).toBe(200);
    });

    it('should set return date if request is valid.', async () => {
        await execute();
        const rentalInDb = await Rental.findById(rental._id);
    
        expect(Date.now() - rentalInDb.dateReturned).toBeLessThan(60 * 1000);
    });

    it('should set rental fee if request is valid.', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        await execute();
        const rentalInDb = await Rental.findById(rental._id);
    
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock if request is valid.', async () => {

        await execute();
        const movieInDb = await Movie.findById(movieId);
    
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return rental if request is valid.', async () => {

        const res  = await execute();
        const rentalInDb = await Rental.findById({ _id: rental._id });
    
        // expect(rentalInDb).toHaveProperty('dateOut');
        // expect(rentalInDb).toHaveProperty('dateReturned');
        // expect(rentalInDb).toHaveProperty('rentalFee');
        // expect(rentalInDb).toHaveProperty('customer');
        // expect(rentalInDb).toHaveProperty('movie');

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'
        ]));
    });

});