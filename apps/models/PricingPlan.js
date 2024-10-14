import mongoose from "mongoose";
import { Schema } from "mongoose";
const PricingPlanSchema = Schema({
name:{type:String,required:true},
pcategory:{type:String,required:true},
desc:{type:String,required:true},
features:{type:String,required:true},
ram:{type:String},
cpu:{type:String},
storage:{type:String},
pricephour:{type:String},
pricepmonth:{type:String},
isfree:{type:Boolean,default:false},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.PricingPlan||mongoose.model('PricingPlan',PricingPlanSchema);