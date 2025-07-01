import mongoose from "mongoose";
import { Schema } from "mongoose";
const WebBuilderSchema = Schema({
userid:{ type: Schema.Types.ObjectId,ref:'User'},
name:{type:String,required:true},
startdate:{type:Date,required:true},
projectstatus:{type:String},
deploymentstatus:{type:String},
url:{type:String},
cpuusage:{type:String},
memoryusage:{type:String},
storageusage:{type:String},
planid:{ type: Schema.Types.ObjectId,ref:'PricingPlan'},
startbilingdate:{type:Date},
endbilingdate:{type:Date},
billstatus:{type:String},
customdomain:{type:String},
arn:{type:String,default:""},
webbulder:{type:String,default:""},
projecturl:{type:String,default:""},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.WebBuilder||mongoose.model('WebBuilder',WebBuilderSchema);