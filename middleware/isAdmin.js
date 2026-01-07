export function isAdmin(req, res, next) {
if(!req.auth){
    return res.status(401).json({ message: "Unauthorised" });
}

if(!req.auth.isAdmin) {
    return res.status(403).json({message : "Forbidden"});
}

next();
}