
import mongoose from "mongoose";
import { Schema } from "mongoose";

const VirtualSpaceSchema = Schema({

userid:{ type: Schema.Types.ObjectId,ref:'User', required: true},
name:{type:String,required:true, unique: true},
startdate:{type:Date,required:true},
projectstatus:{type:String, default: "creating"},
deploymentstatus:{type:String},
url:{type:String},
cpuusage:{type:String, default: "0"},
memoryusage:{type:String, default: "0"},
storageusage:{type:String, default: "0"},
planid:{ type: Schema.Types.ObjectId,ref:'PricingPlan', required: true},
startbilingdate:{type:Date},
endbilingdate:{type:Date},
billstatus:{type:String, default: "pending"},
customdomain:{type:String},
arn:{type:String,default:""},
projecturl:{type:String,default:""},

},{timestamps:true})

mongoose.models = {}
export default mongoose.model.VirtualSpace||mongoose.model('VirtualSpace',VirtualSpaceSchema);