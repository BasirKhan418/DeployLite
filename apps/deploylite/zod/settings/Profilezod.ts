import {z} from 'zod';

export const Profilezod = z.object({
    email: z.string().email(),
    phone: z.string(),
    name: z.string(),
    username: z.string(),
    bio: z.string(),
})

export type ProfileType = z.infer<typeof Profilezod>