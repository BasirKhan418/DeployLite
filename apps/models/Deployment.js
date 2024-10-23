import mongoose from "mongoose";
import { Schema } from "mongoose";
const DeploymentSchema = Schema({
userid:{ type: Schema.Types.ObjectId,ref:'User'},
projectid:{ type: Schema.Types.ObjectId,ref:'Project'},
status:{type:String,required:true},
deploymentdate:{type:Date,required:true},
commit_message:{type:String},
author_name:{type:String},
deploymentlogs:{type:Array,required:false}
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.Deployment||mongoose.model('Deployment',DeploymentSchema);