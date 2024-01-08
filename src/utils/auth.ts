import * as jwt from "jsonwebtoken";

export const APP_SECRET = "GraphQL-is-aw3some";

export interface AuthTokenPayload {
    userId : number;
}

export function decodeAuthHeader(authHeader: string): AuthTokenPayload {
    // if(!authHeader) throw new Error("No authentication header");
    // if(!authHeader.toLowerCase().startsWith("bearer "))
    //     throw new Error("Invalid authentication header");

const token = authHeader.replace("Bearer ","");
        const decodedToken = jwt.verify(token, APP_SECRET) as AuthTokenPayload;
    return decodedToken;        
}

