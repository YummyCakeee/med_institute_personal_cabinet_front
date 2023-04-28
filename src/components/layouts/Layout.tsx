import React from "react"
import Header from "components/modules/header/Header"
import Footer from "components/modules/footer/Footer"
import styles from "./Layout.module.scss"
import BreadCrumbs from "components/modules/breadCrumbs"
import Script from "next/script"
import Head from "next/head"

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
            <Script
                type="text/javascript"
                src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.2.0/adapter.min.js"
            />
            <Script
                id="q_script"
                strategy="afterInteractive"
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html:
                        `window.qumicon_config = {
                            janus: "ws://46.19.65.37:8188",
                            hub: "http://46.19.65.37:5264/qumicon-hub",
                            hasAuth: false,
                            login: {
                                method: 'POST',
                                url: 'path/to/login/route',
                                fields: {
                                    login: "userName",
                                    password: "password"
                                }
                            },
                            userInfo: {
                                method: 'GET',
                                url: 'path/to/userInfo/route'
                            },
                        }`
                }}
            />
            <Script
                type="module"
                src="/qumicon-main/build/assets/qumicon.js"
            />
            <Head>
                <link rel="stylesheet" href="/qumicon-main/build/assets/qumicon.css" />
            </Head>
            {showHeader &&
                <Header />
            }
            <div className={styles.content}>
                <BreadCrumbs />
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout