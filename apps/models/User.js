import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
}

},{timestamps:true})
mongoose.models = {}
export default mongoose.model.User||mongoose.model('User',UserSchema);