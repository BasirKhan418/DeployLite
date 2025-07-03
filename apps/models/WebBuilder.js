import mongoose from "mongoose";
import { Schema } from "mongoose";

const WebBuilderSchema = Schema({
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
webbuilder:{type:String,default:"WordPress"}, 
projecturl:{type:String,default:""},

dbname:{type:String,required:true},
dbuser:{type:String,required:true}, 
dbpass:{type:String,required:true},
},{timestamps:true})

WebBuilderSchema.index({ userid: 1 });
WebBuilderSchema.index({ name: 1 }, { unique: true });
WebBuilderSchema.index({ projectstatus: 1 });

mongoose.models = {}
export default mongoose.model.WebBuilder||mongoose.model('WebBuilder',WebBuilderSchema);