import React from "react"
import { wrapper } from "store"
import { clearBreadCrumbs } from "store/breadCrumbsSlice"
import ConfirmTemplate from "components/templates/confirm"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"

const Confirm = () => {
    const user = useSelector(userSelector)

    return (
        <>
            {user.authorized ?
                <ConfirmTemplate />
                :
                <UnauthorizedTemplate />
            }
        </>
    )
}

Confirm.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(clearBreadCrumbs())
})

export default Confirm