import mongoose from "mongoose";
import { Schema } from "mongoose";
const WalletSchema = Schema({
userid:{ type: Schema.Types.ObjectId,ref:'User'},
balance:{type:Number,required:true,default:0},
transactions:{type:Array,required:false},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.Wallet||mongoose.model('Wallet',WalletSchema);