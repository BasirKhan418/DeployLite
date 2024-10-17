import {z} from 'zod';

export const CreateprojectSchema = z.object({
name:z.string().min(5),

})


export type CreateprojectSchemaType = z.infer<typeof CreateprojectSchema>