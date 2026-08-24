const userRepository = require('../repositories/User.repository');
const roleRepository = require('../repositories/Role.repository');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

class AuthService {
  /**
   * Authenticate user and return tokens
   */
  async login(email, password) {
    // 1. Check if user exists (include password for comparison)
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ApiError(401, 'Incorrect email or password');
    }

    // 2. Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Incorrect email or password');
    }

    // 3. Generate Token
    const payload = user.getJwtPayload();
    const token = this.generateToken(payload);

    // 4. Clean user object before returning (remove password manually just in case)
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  /**
   * Register a new user
   */
  async signup(name, email, password) {
    // 1. Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    // 2. Find or create default "User" role
    let role = await roleRepository.findByName('User');
    if (!role) {
      // Fallback: create User role if it doesn't exist
      role = await roleRepository.create({ name: 'User', permissions: [] });
    }

    // 3. Create User
    const user = await userRepository.create({
      name,
      email,
      password,
      roleId: role._id,
    });

    // 4. Generate Token (auto login)
    const payload = user.getJwtPayload();
    const token = this.generateToken(payload);

    // 5. Clean user object before returning
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  /**
   * Fetch authenticated user details based on token payload
   */
  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User no longer exists');
    }
    return user;
  }

  /**
   * Generate JWT
   * For the MVP, we are not using a DB-stored refresh token.
   * Standard stateless JWT authentication.
   */
  async googleMock() {
    const email = 'google-mock@example.com';
    const name = 'Google User';
    
    let user = await userRepository.findByEmail(email);
    if (!user) {
      let role = await roleRepository.findByName('User');
      if (!role) {
        role = await roleRepository.create({ name: 'User', permissions: [] });
      }
      user = await userRepository.create({
        name,
        email,
        password: 'GoogleMockPassword123!',
        roleId: role._id,
      });
    }

    const payload = user.getJwtPayload();
    const token = this.generateToken(payload);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async googleLogin(idToken) {
    if (!idToken) {
      throw new ApiError(400, 'ID token is required');
    }

    let ticket;
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!response.ok) {
        throw new Error('Google token verification failed');
      }
      ticket = await response.json();
    } catch (err) {
      throw new ApiError(401, 'Invalid Google token');
    }

    const { email, name, email_verified } = ticket;
    if (!email || email_verified !== 'true') {
      throw new ApiError(401, 'Google email not verified');
    }

    let user = await userRepository.findByEmail(email);
    if (!user) {
      let role = await roleRepository.findByName('User');
      if (!role) {
        role = await roleRepository.create({ name: 'User', permissions: [] });
      }
      user = await userRepository.create({
        name: name || 'Google User',
        email,
        password: Math.random().toString(36).slice(-10) + 'A1!',
        roleId: role._id,
      });
    }

    const payload = user.getJwtPayload();
    const token = this.generateToken(payload);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  generateToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }
}

module.exports = new AuthService();
