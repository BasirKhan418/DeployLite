import mongoose from "mongoose";
import { Schema } from "mongoose";
const TempSchema = Schema({
email:{type:String,required:true},
amount:{type:Number,required:true},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.TempPayment||mongoose.model('Aws',TempSchema);