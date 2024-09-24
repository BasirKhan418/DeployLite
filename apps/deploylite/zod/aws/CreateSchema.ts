import {z} from 'zod';

export const CreateSchema = z.object({
awskey:z.string().min(5),
awssecret:z.string().min(5),
region:z.string().min(4),
vpcid:z.string().min(5),
subnetid1:z.string().min(5),
subnetid2:z.string().min(5),
subnetid3:z.string().min(5),
securitygroupid:z.string().min(5),
s3bucket:z.string().min(4),
})


export type CreateSchemaType = z.infer<typeof CreateSchema>
