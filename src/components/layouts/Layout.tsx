import React from "react"
import Header from "components/modules/header/Header"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}

export default Layout