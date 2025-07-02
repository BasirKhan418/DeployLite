import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface DecodedToken {
  email: string;
  username: string;
  name?: string;
  iat?: number;
  exp?: number;
}

const CheckAuth = async (): Promise<{ 
  result: boolean; 
  email: string; 
  username: string; 
  name?: string;
  error?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      console.log('CheckAuth: No token found in cookies');
      return { 
        result: false, 
        email: '', 
        username: '',
        error: 'No authentication token'
      };
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      console.error('CheckAuth: SECRET_KEY not found in environment variables');
      return { 
        result: false, 
        email: '', 
        username: '',
        error: 'Server configuration error'
      };
    }

    try {
      const decoded = jwt.verify(token, secretKey) as DecodedToken;
      
      if (!decoded.email || !decoded.username) {
        console.log('CheckAuth: Invalid token payload - missing required fields');
        return { 
          result: false, 
          email: '', 
          username: '',
          error: 'Invalid token payload'
        };
      }

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.log('CheckAuth: Token has expired');
        return { 
          result: false, 
          email: '', 
          username: '',
          error: 'Token expired'
        };
      }

      console.log('CheckAuth: Authentication successful for:', decoded.email);
      return { 
        result: true, 
        email: decoded.email, 
        username: decoded.username,
        name: decoded.name 
      };
    } catch (jwtError: any) {
      console.log('CheckAuth: JWT verification failed:', jwtError.message);
      return { 
        result: false, 
        email: '', 
        username: '',
        error: 'Token verification failed'
      };
    }
  } catch (error: any) {
    console.error('CheckAuth: Unexpected error:', error.message);
    return { 
      result: false, 
      email: '', 
      username: '',
      error: 'Authentication service error'
    };
  }
};

export default CheckAuth;