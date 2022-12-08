import 'styles/globals.css'
import type { AppProps } from 'next/app'
import ModalWindowWrapper from 'context/modalWindowContext'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReactNotifications />
      <ModalWindowWrapper>
        <Component {...pageProps} />
      </ModalWindowWrapper>
    </>
  )
}