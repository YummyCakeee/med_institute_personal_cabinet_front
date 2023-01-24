export type UserWithCertificatesType = {
    user: UserProfileType,
    certificates: CertificateType[]
}


export type UserProfileType = {
    userId?: string,
    userName?: string,
    dateOfBirth?: string,
    profilePicture?: string,
    createDate?: string,
    firstName?: string,
    secondName?: string,
    lastName?: string,
    user?: ApplicationUser
}

export type ApplicationUser = {
    id?: string
    userName?: string,
    normalizedUserName?: string
    email?: string,
    normalizedEmail?: string,
    emailConfirmed?: boolean,
    passwordHash?: string,
    securityStamp?: string,
    concurrencyStamp?: string,
    phoneNumber?: string,
    phoneNumberConfirmed?: boolean,
    twoFactorEnabled?: boolean,
    lockoutEnd?: string,
    lockoutEnabled?: boolean,
    accessFailedCount?: number,
    claims?: StringIdentityUserClaim[],
    logins?: StringIdentityUserLogin[],
    tokens?: StringIdentityUserToken[],
    userRoles?: ApplicationUserRole[]
}

export type StringIdentityUserClaim = {
    id: string,
    userId: string
    claimType?: string,
    claimValue?: string
}


export type StringIdentityUserLogin = {
    loginProvider?: string,
    providerKey?: string,
    providerDisplayName?: string,
    userId?: string
}

export type StringIdentityUserToken = {
    userId?: string,
    loginProvider?: string,
    name?: string,
    value?: string
}

export type ApplicationUserRole = {
    userId?: string,
    roleId?: string,
    role: ApplicationRole
}

export type ApplicationRole = {
    id?: string,
    name?: string,
    normalizedName?: string
    concurrencyStamp?: string
}

export type CertificateType = {
    name: string,
    date: string
}