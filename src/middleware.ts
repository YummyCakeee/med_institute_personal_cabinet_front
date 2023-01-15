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



// import { ROUTE_COLLECTIONS, ROUTE_COURSES, ROUTE_EDUCATIONAL_PROGRAMS, ROUTE_PROFILE, ROUTE_REGISTRATION, ROUTE_THEMES, ROUTE_USERS } from "constants/routes";
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//     const authCookie = request.cookies.get('.AspNetCore.Identity.Application')
//     const urlBase = request.url.match(/(http:\/\/.*)\/.*/)
//     console.log(urlBase)
//     if (!authCookie && urlBase && urlBase[1])
//         return NextResponse.rewrite(new URL(ROUTE_REGISTRATION, urlBase[1]))
//     return NextResponse.next()
// }

// export const config = {
//     matcher: [
//         `${ROUTE_COURSES}/:path*`,
//         `${ROUTE_USERS}/:path*`,
//         `${ROUTE_THEMES}/:path*`,
//         `${ROUTE_COLLECTIONS}/:path*`,
//         `${ROUTE_EDUCATIONAL_PROGRAMS}/:path*`,
//         `${ROUTE_PROFILE}/:path*`,
//     ]
// }