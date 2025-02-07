import mongoose from "mongoose";
import { Schema } from "mongoose";
const NotificationSchema = Schema({
userid:{ type: Schema.Types.ObjectId,ref:'User'},
email:{type:String,required:true},
deployment:{type:Boolean,default:true},
buildfailure:{type:Boolean,default:true},
securityalerts:{type:Boolean,default:true},
emailnotification:{type:Boolean,default:true},
slacknotification:{type:Boolean,default:false},
sms:{type:Boolean,default:false},
inapp:{type:Boolean,default:true},

},{timestamps:true})
mongoose.models = {}
export default mongoose.model.Notification||mongoose.model('Notification',NotificationSchema);