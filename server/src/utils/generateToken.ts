import jwt from 'jsonwebtoken';

const generateToken = (id: string, name: string = '', email: string = '') => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export default generateToken;
