import { Router } from "express";

import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utilis/constants.mjs";
import { createUserValidationSchema } from "../utilis/validationSchema.mjs";
import { resolveIndexByUserId } from "../utilis/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utilis/helpers.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("must be a string!")
    .notEmpty()
    .withMessage("Not Empty!")
    .isLength({ min: 3, max: 10 })
    .withMessage("must be at least 3-10 characters"),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;

    //when filter and value are undefined mockUsers);
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );

    return response.send(mockUsers);
  }
);

router.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);
  console.log(parsedId);
  if (isNaN(parsedId))
    return response
      .status(400)
      .send({ msg: "This is not a number. You must enter a nunmber!" });

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

// router.post(
//   "/api/users",
//   checkSchema(createUserValidationSchema),
//   (request, response) => {
//     const result = validationResult(request);
//     console.log(result);

//     if (!result.isEmpty())
//       return response.status(400).send({ errors: result.array() });
//     const data = matchedData(request);

//     const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
//     mockUsers.push(newUser);
//     return response.status(201).send(newUser);
//   }
// );

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return response.sendStatus(200);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());

    const data = matchedData(request);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
  }
);

router.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
