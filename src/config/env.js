const { cleanEnv, str, port, url } = require('envalid');
const dotenv = require('dotenv');

dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 5000 }),
  MONGO_URI: str({ default: 'mongodb://localhost:27017/digitory' }),
  JWT_SECRET: str({ default: 'supersecret_jwt_key_change_me' }),
  JWT_REFRESH_SECRET: str({ default: 'supersecret_refresh_key_change_me' }),
  JWT_EXPIRES_IN: str({ default: '3d' }),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
  CORS_ORIGIN: str({ default: '*' }),
});

module.exports = env;
