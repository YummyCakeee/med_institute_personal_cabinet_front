import 'styles/globals.scss'
import type { AppProps } from 'next/app'
import ModalWindowWrapper from 'context/modalWindowContext'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { useEffect } from "react"
import { Provider } from 'react-redux'
import store from 'store'
import { getUserInfo } from 'store/userSlice'

store.dispatch(getUserInfo())

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <ReactNotifications />
        <ModalWindowWrapper>
          <Component {...pageProps} />
        </ModalWindowWrapper>
      </Provider>
    </>
  )
}