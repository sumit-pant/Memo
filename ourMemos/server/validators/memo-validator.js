const { z } = require("zod")

const memoValidSchema = z.object({
    username: z
        .string({ required_error: "Name is required." }),
    email: z
        .string({ required_error: "Name is required." }),
    date: z
        .string({ required_error: "Name is required." }),
    time: z
        .string({ required_error: "Name is required." }),
    memo: z
        .string({ required_error: "Memo is required." })
        .trim()
        .min(1, { message: "Memo must contain at least one character" })
        .max(100, { message: "Memo must not be greater than hundred characters." }),
    fileName: z
        .string(),
    filePath: z
        .string()
})

module.exports = memoValidSchema