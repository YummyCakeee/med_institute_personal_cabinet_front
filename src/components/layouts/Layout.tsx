import React from "react"
import Header from "components/modules/header/Header"
import Footer from "components/modules/footer/Footer"
import styles from "./Layout.module.scss"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout