import { HttpStatus, Injectable, NestMiddleware, Optional } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserAgentOptions{
    accepted?: string[];
}

@Injectable()
export class UserAgentMiddleware implements NestMiddleware{

    constructor(@Optional() private options: UserAgentOptions){

    }
    use(req: Request, res:Response, next: NextFunction){
        const ua = req.headers["user-agent"];

        if(!this.isUserAgentAcceptable(ua!)){
             console.log("User-Agent rejected");
            res.status(HttpStatus.FORBIDDEN).json({message: "Not Allowed"});
            return;
        }
        req["ua"] = ua;
        // console.log(ua)
        next();
    }


    private isUserAgentAcceptable(userAgent: string){
        const acceptedUserAgents = this.options?.accepted || [];

        return acceptedUserAgents.some((agent)=> userAgent.toLowerCase().includes(agent.toLowerCase()));
    }
}
