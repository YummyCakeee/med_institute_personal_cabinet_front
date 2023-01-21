import React from "react"
import Header from "components/modules/header/Header"
import Footer from "components/modules/footer/Footer"
import styles from "./Layout.module.scss"

type LayoutProps = {
    children: React.ReactNode,
    showHeader?: boolean
}

const Layout = ({
    children,
    showHeader = true
}: LayoutProps) => {
    return (
        <div className={styles.container}>
            {showHeader &&
                <Header />
            }
            <div className={styles.content}>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout