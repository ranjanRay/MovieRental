const auth = require('../../../middleware/auth');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const _ = require('lodash');

describe('Unit testing auth middleware', () => {
    it('should populate the user property in req object', () => {
        const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();
    
        auth(req, res, next);
        expect(req.user).toMatchObject(user);
    });
});