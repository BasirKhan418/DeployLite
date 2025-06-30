import mongoose from "mongoose";
import { Schema } from "mongoose";
const ProjectSchema = Schema({
userid:{ type: Schema.Types.ObjectId,ref:'User'},
name:{type:String,required:true},
type:{type:String,required:true},
repourl:{type:String},
repobranch:{type:String},
projecturl:{type:String},
startdate:{type:Date,required:true},
lastdeploy:{type:Date},
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
techused:{type:String},
buildcommand:{type:String},
installcommand:{type:String},
startcommand:{type:String},
rootfolder:{type:String,default:"/"},
outputfolder:{type:String,default:"not applicable"},
env:{type:String},
hookid:{type:String},
customdomain:{type:String},
arn:{type:String,default:""},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.Project||mongoose.model('Project',ProjectSchema);