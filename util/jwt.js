import expressJwt from 'express-jwt';

export const authJwt = () => {
  const secret = process.env.JWT_SECRET;
  const baseURL = process.env.API_BASE_URL;

  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/upload(.*)/, methods: ['GET', 'OPTIONS'] },

      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },

      `${baseURL}/users/login`,
      `${baseURL}/users`,
    ],
  });
};

const isRevoked = (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
};
