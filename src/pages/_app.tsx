import 'styles/globals.css'
import type { AppProps } from 'next/app'
import ModalWindowWrapper from 'context/modalWindowContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalWindowWrapper>
      <Component {...pageProps} />
    </ModalWindowWrapper>
  )
}