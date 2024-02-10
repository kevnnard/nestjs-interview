// Purpose: JWT secret and expiration constants.
// The JWT secret and expiration constants are used to configure the JWT module and strategy in the auth module.
const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
export { jwtConstants };
