import { z } from 'zod';

class AuthValidation {
  // region Register Validation
  static registerUser = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });


  // region Login Validation
  static loginUser = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });
}

export default AuthValidation;