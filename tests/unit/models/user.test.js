const { User } = require('../../../models/user');
// const jest = require('jest');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const _ = require('lodash');

describe('user model', () => {
    it('should return an authentication token', () => {
        const payload = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(_.pick(decoded, ['_id', 'isAdmin'])).toMatchObject(payload);
    });
});