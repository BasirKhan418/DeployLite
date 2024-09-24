import {z} from 'zod';

export const Accountzod = z.object({
    password: z.string().min(5),
    currentPassword: z.string(),
})
export const AccountTogglezod = z.object({
    twofactor: z.boolean(),
})

export type AccountzodType = z.infer<typeof Accountzod>
export type AccountTogglezodType = z.infer<typeof AccountTogglezod>