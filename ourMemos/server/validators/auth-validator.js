const { z } = require("zod")

const loginSchema = z.object({
    email: z
        .string({ required_error: "Name is required." })
        .trim()
        .email({ message: "Invalid Email Address" })
        .min(5, { message: "Email must be at least five characters long." }),
    password: z
        .string({ required_error: "Name is required." })
        .min(5, { message: "Password must be at least five characters long." })
        .max(15, { message: "Password must not be greater than fifteen character." })
})

const registerSchema = loginSchema.extend({
    username: z
        .string({ required_error: "Name is required." })
        .trim()
        .min(3, { message: "Name must be at least three characters long." })
        .max(15, { message: "Name must not be greater than fifteen character." }),
    phone: z
        .string({ required_error: "Phone is required." })
        .trim()
        .min(10, { message: "Invalid Phone Number" })
        .max(10, { message: "Invalid Phone Number" })
})

module.exports = { registerSchema, loginSchema }