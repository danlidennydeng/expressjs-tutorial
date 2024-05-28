import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utilis/constants.mjs";

import passport from "passport";
import "./strategies/local-strategy.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", { maxAge: 30000, signed: true }); // 60000 = 60 seconds. 2 hours
  response.status(201).send({ msg: "Hello, Denny!" });
});

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

// app.post("/api/auth", (request, response) => {
//   const {
//     body: { username, password },
//   } = request;

//   const findUser = mockUsers.find((user) => user.username === username);

//   if (!findUser || findUser.password !== password)
//     return response.status(401).send({ msg: "Bad Credential!" });

//   request.session.user = findUser;

//   return response.status(200).send(findUser);
// });

app.get("/api/auth/status", (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});
