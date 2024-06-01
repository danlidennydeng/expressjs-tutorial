export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be within 5 or 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty!",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },
  displayName: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
};
