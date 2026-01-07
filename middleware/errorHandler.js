export function errorHandler(err, req, res, next) {
    if(err.name === "UnauthorizedError") {
    if(err.message === "jwt expired") {
        
        res.status(401).json({
            message: "Session expired. Log in again"
        });
    }

        return res.status(401).json({
            message: "Invalid or missing token"
        });

    }
    if(err.name === "ValidationError") {
        return res.status(400).json({ message: err });
    }
     return res.status(500).json({ message: 'Internal server question'});
}