import mongoose from "mongoose";
import { Schema } from "mongoose";
const OtpSchema = Schema({
userid:{ type: Schema.Types.ObjectId,ref:'User'},
otp:{type:String,required:true},
email:{type:String,required:true},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.Otp||mongoose.model('Otp',OtpSchema);