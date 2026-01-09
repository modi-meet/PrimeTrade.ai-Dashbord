// @ts-nocheck
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'secret'
            );

            // Ensure decoded is an object and has an 'id' property
            if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
                const payload = decoded as DecodedToken;
                req.user = await User.findById(payload.id).select('-password');
                next();
            } else {
                // Handle cases where the token payload is not as expected
                res.status(401).json({ message: 'Not authorized, invalid token payload' });
            }
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
