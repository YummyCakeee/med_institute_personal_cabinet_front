import React from "react"
import RecoveryTemplate from "components/templates/recovery"
import { wrapper } from "store"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"

const Recovery = () => {

    return (
        <RecoveryTemplate />
    )
}

Recovery.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(clearBreadCrumbs())
})

export default Recovery