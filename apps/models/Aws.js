import mongoose from "mongoose";
import { Schema } from "mongoose";
const AwsSchema = Schema({
userid:{ type: Schema.Types.ObjectId,ref:'User'},
email:{type:String,required:true},
awskey:{type:String,required:true},
awssecret:{type:String,required:true},
region:{type:String,required:true},
vpcid:{type:String,required:true},
subnetid1:{type:String,required:true},
subnetid2:{type:String,required:true},
subnetid3:{type:String,required:true},
securitygroupid:{type:String,required:true},
s3:{type:Boolean,default:true},
ec2:{type:Boolean,default:true},
fargate:{type:Boolean,default:true},
ecs:{type:Boolean,default:true},
ecr:{type:Boolean,default:false},
s3bucket:{type:String,required:false},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.Aws||mongoose.model('Aws',AwsSchema);