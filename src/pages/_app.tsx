import 'styles/globals.scss'
import type { AppProps } from 'next/app'
import ModalWindowWrapper from 'context/modalWindowContext'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { useEffect, FC } from "react"
import { Provider } from 'react-redux'
import { getUserInfo } from 'store/userSlice'
import { wrapper } from 'store'
import { injectStore } from 'utils/axios/interceptor'

const App: FC<AppProps> = ({ Component, ...rest }: AppProps) => {

  const { store, props } = wrapper.useWrappedStore(rest);
  useEffect(() => {
    injectStore(store)
    store.dispatch(getUserInfo())
  }, [store])

  return (
    <>
      <Provider store={store}>
        <ReactNotifications />
        <ModalWindowWrapper>
          <Component {...props.pageProps} />
        </ModalWindowWrapper>
      </Provider>
    </>
  )
}

export default App