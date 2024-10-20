import {z} from 'zod';

export const CreateprojectSchema = z.object({
name:z.string().min(5),
type:z.string().min(2),
repourl:z.string().min(5),
repobranch:z.string().min(2),
techused:z.string().min(2),
buildcommand:z.string().min(2),
startcommand:z.string().min(2),
rootfolder:z.string().min(1),
outputfolder:z.string().min(1),
installcommand:z.string().min(2),
planid:z.string().min(5),
})


export type CreateprojectSchemaType = z.infer<typeof CreateprojectSchema>