 import { expressjwt } from "express-jwt";

export  function authJwt() {
    
    const secret = process.env.JWT_SECRET
    return  expressjwt({
        secret,
        algorithms : ['HS256']
    }).unless({
        path : [ 
              { url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"] },
              { url: "/api/auth/register", methods: ["POST"] },
              { url: "/api/auth/login", methods: ["POST"] }
         ]
    })
}
