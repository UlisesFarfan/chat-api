import "dotenv/config";
import passport from "passport";

import oauth2orize, { exchange } from "oauth2orize";

import {
  IStrategyOptionsWithRequest,
  Strategy as LocalStrategy,
} from "passport-local";
import { Strategy as ClientPasswordStrategy } from "passport-oauth2-client-password";
import UserModel from "../models/user.schema";
import { hashPassword } from "../utils/password.utils";
import JwtModel from "../models/jwt.schema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyToken,
} from "../utils/jwt.utils";

const server = oauth2orize.createServer();

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((id: string, done: any) => {
  UserModel.findById(id)
    .populate({
      path: "chats"
    })
    .then((user: any) => {
      done(null, user);
    })
    .catch((err: any) => {
      done(err, null);
    });
});

server.grant(
  oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
    const code = generateAccessToken(user);
    const refresh = generateRefreshToken(user);
    const jwt = new JwtModel({
      access: code,
      refresh: refresh,
    });
    jwt
      .save()
      .then((response: any) => {
        return done(null, code);
      })
      .catch((err: any) => {
        return done(err);
      });
  })
);

passport.use(
  "client-password",
  new ClientPasswordStrategy(function (client_id, client_secret, done) {
    UserModel.findOne({ "client.client_id": client_id })
      .populate({
        path: "chats"
      })
      .then((response: any) => {
        if (!response) {
          return done(null, false);
        }
        return done(null, response);
      })
      .catch((err: any) => {
        return done(err);
      });
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username: string, password: string, done: any) => {
      try {
        const user = await UserModel.findOne({
          email: username,
        }).populate({
          path: "chats"
        }).populate({
          path: "token",
          select: "access refresh",
        });

        if (!user) {
          return done(null, false, {
            status: 404,
            message: "User not found",
          });
        }

        const { hash } = hashPassword(password, user.salt);

        if (hash !== user.hash) {
          return done(null, false, {
            status: 403,
            message: "Invalid password",
          });
        }

        return done(null, user, { scope: "*" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

type UserTypes = {
  _id: string;
  email: string;
  name: string;

  role: string;
  client: {
    client_id: string;
    client_secret: string;
  };
  hash: string;
  salt: string;
};

server.exchange(
  exchange.password(async function (client, username, password, scope, done) {
    try {
      let tokens: any;
      // Find user by email
      const userData: UserTypes | any = await UserModel.findOne({
        email: username,
      }).populate({
        path: "chats"
      }).populate({
        path: "token",
        select: "access refresh",
      });

      // If user not found
      if (!userData) {
        return done(null, false);
      }

      // Verify password
      function verifyPassword(password: string, hash: string, salt: string) {
        const { hash: hashedPassword } = hashPassword(password, salt);
        return hashedPassword === hash;
      }

      const isPasswordValid = verifyPassword(
        password,
        userData.hash,
        userData.salt
      );

      // If password is not valid
      if (!isPasswordValid) {
        return done(null, false);
      }

      userData.hash = undefined;
      userData.salt = undefined;

      // variable jwt can be of type any or { _id: string, access: string, refresh: string }
      let jwt: any | { _id: string; access: string; refresh: string };

      // If user has token
      if (userData.token?.access) {
        // Extract access and refresh token from user
        const { access, refresh } = userData.token;

        try {
          // Verify access token
          verifyToken(access);

          tokens = {
            access_token: access,
            refresh_token: refresh,
          };

          userData.token = undefined;

          // If access token is valid
          const responseAccess: any = {
            user: userData,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          };

          // Return access token
          return done(null, "created succesfuly", responseAccess);
        } catch (error: any) {
          if (error.name === "TokenExpiredError") {
            // If access token is not valid
            const accessToken: string = generateAccessToken({
              email: username,
            });
            const refresToken: string = generateRefreshToken({
              email: username,
            });

            // Save new token to database
            jwt = await JwtModel.findOneAndUpdate(
              { access: userData.token?.access },
              {
                $set: {
                  access: accessToken,
                  refresh: refresToken,
                },
              },
              { new: true, upsert: true, runValidator: true }
            ).exec();

            // Update user token
            const updateUser = await UserModel.findOneAndUpdate(
              { email: username },
              {
                $set: {
                  token: jwt._id,
                },
              },
              {
                new: true,
                upsert: true,
                runValidator: true,
                fields: {
                  hash: 0,
                  salt: 0,
                  token: 0,
                },
              }
            ).exec();

            // Return new access token
            const responseAccess: any = {
              user: updateUser,
              access_token: accessToken,
              refresh_token: refresToken,
            };

            return done(null, "created succesfuly", responseAccess);
          }

          // If access token is not valid
          return done(null, error.message as string);
        }
      }

      // If user has no token and is valid, generate new token
      const accessToken: string = generateAccessToken({ email: username });

      // Generate refresh token
      const refresToken: string = generateRefreshToken({ email: username });

      // Save new token to database
      jwt = await JwtModel.findOneAndUpdate(
        { access: userData.token?.access },
        {
          $set: {
            access: accessToken,
            refresh: refresToken,
          },
        },
        { new: true, upsert: true, runValidator: true }
      ).exec();

      // Update user token
      const updateUser = await UserModel.findOneAndUpdate(
        { email: username },
        {
          $set: {
            token: jwt._id,
          },
        },
        {
          new: true,
          runValidator: true,
          fields: {
            hash: 0,
            salt: 0,
            token: 0,
          },
        }
      )

        .populate({
          path: "token",
          select: "access",
        })
        .exec();

      // Assign token to user
      const user: any | undefined = {
        user: updateUser,
        access_token: jwt.access,
        refresh_token: jwt.refresh,
      };

      // Return token
      return done(null, "created succesfuly", user);
    } catch (err: any) {
      // If error
      // Return error
      return done(err);
    }
  })
);

server.exchange(
  exchange.refreshToken(async function (client, refreshToken, scope, done) {
    try {
      // Verify refresh token
      const decoded: any = verifyRefreshToken(refreshToken);

      // Find user by email
      const userData: UserTypes | any = await UserModel.findOne({
        email: decoded.payload?.email,
      })
        .select("-hash -salt")

        .populate({
          path: "token",
          select: "access refresh",
        });

      // Compare refresh token with user refresh token
      if (userData?.token?.refresh !== refreshToken) {
        return done(null, false, "Invalid refresh token");
      }

      // If user not found
      if (!userData) {
        return done(null, false, "User not found");
      }

      if (userData.token?.access) {
        try {
          // Verify access token
          verifyToken(userData.token?.access);

          const tokens = {
            access_token: userData.token?.access,
            refresh_token: userData.token?.refresh,
          };

          userData.token = undefined;

          // If access token is valid
          const responseAccess: any = {
            user: userData,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
          };

          // Return access token
          return done(null, "response succesfuly", responseAccess);
        } catch (error: any) {
          if (error.name === "TokenExpiredError") {
            const accessToken: string = generateAccessToken({
              email: userData.email,
            });
            const refresToken: string = generateRefreshToken({
              email: userData.email,
            });

            // Save new token to database
            const jwt = await JwtModel.findOneAndUpdate(
              { access: userData.token?.access },
              {
                $set: {
                  access: accessToken,
                  refresh: refresToken,
                },
              },
              { new: true, upsert: true, runValidator: true }
            ).exec();

            // Update user token
            const updateUser = await UserModel.findOneAndUpdate(
              { email: userData.email },
              {
                $set: {
                  token: jwt._id,
                },
              },
              {
                new: true,
                upsert: true,
                runValidator: true,
              }
            )
              .select("-hash -salt -token")

              .exec();

            // Assign token to user
            const user: any | undefined = {
              user: updateUser,
              access_token: jwt.access,
              refresh_token: jwt.refresh,
            };

            // Return token
            return done(null, "created succesfuly", user);
          }

          return done(error, "Invalid Access token");
        }
      }
    } catch (err: any) {
      // If error
      // Return error
      if (err.name === "TokenExpiredError") {
        return done(err, "Refresh Token expired");
      }

      return done(err, "Invalid Refresh Token");
    }
  })
);

server.exchange(
  exchange.clientCredentials(function (client, scope, done) {
    UserModel.findOne({ "client.client_id": client })
      .then((response: any) => {
        if (!response) {
          return done(null, false);
        }
        return done(null, response);
      })
      .catch((err: any) => {
        return done(err);
      });
  })
);

export { passport, server };
