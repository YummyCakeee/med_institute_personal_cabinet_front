import { ROUTE_REGISTRATION } from "constants/routes";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    return NextResponse.rewrite(new URL(ROUTE_REGISTRATION, request.url))

}

export const config = {
    matcher: [
        //'/courses', 
        //'/users'
        '/'
    ]
}