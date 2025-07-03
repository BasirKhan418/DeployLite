
import mongoose from "mongoose";
import { Schema } from "mongoose";

const DatabaseSchema = Schema({

userid:{ type: Schema.Types.ObjectId,ref:'User', required: true},
dbname:{type:String,required:true, unique: true},
dbuser:{type:String,required:true},
dbpass:{type:String,required:true},
dbport:{type:String,required:true},
dbtype:{type:String,required:true},
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
arn:{type:String,default:""},
projecturl:{type:String,default:""},
uiurl:{type:String,default:""},
},{timestamps:true})

mongoose.models = {}
export default mongoose.model.Database||mongoose.model('Database',DatabaseSchema);