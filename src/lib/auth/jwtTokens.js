import jwt from "jsonwebtoken";

export const createAccessToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });

export const verifyAccesstoken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    });
  });
