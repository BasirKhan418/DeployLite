import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
name:{type:String,required:true},
username:{type:String,required:false},
email:{type:String,required:true,unique:true},
password:{type:String,required:false},
img:{type:String,required:false},
authtoken:{type:String,required:false},
connectgithub:{type:Boolean,default:false},
githubid:{type:String,required:false},
githubtoken:{type:String,required:false},
isverified:{type:Boolean,default:false},
is0auth:{type:Boolean,default:false},
bio:{type:String,default:""},
phone:{type:String,default:""},
twofactor:{type:Boolean,default:false},
},{timestamps:true})
mongoose.models = {}
export default mongoose.model.User||mongoose.model('User',UserSchema);