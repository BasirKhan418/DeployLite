import jwt from 'jsonwebtoken';
const createDeploymentMiddleware = async (req, res, next) => {
let secret = process.env.SECRET_KEY;
let token = req.headers.authorization;
console.log(token);
console.log(secret);
if (!token) {
    return res.status(401).json({
        message: "No token provided authentication failed"
    });
}
try{
let verifysign = jwt.verify(token, secret);
console.log(verifysign);
if(verifysign!=null){
    next();
}
else{
    return res.status(401).json({
        message: "Invalid token authentication failed"
    });
}
}
catch(err){
    console.log(err);
    return res.status(401).json({
        message: "Invalid token authentication failed"
    });
}
}
export default createDeploymentMiddleware;