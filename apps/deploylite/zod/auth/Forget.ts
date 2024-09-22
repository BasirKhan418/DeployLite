import {z} from 'zod';

export const Forget = z.object({
    email: z.string().email(),
})

export const Reset = z.object({
    password: z.string().min(6),
})

export type ForgetType = z.infer<typeof Forget>
export type ResetType = z.infer<typeof Reset>