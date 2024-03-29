import LoadingErrorTemplate from 'components/templates/loadingError'
import ProfileTemplate from 'components/templates/profile'
import UnauthorizedTemplate from 'components/templates/unauthorized'
import { CertificateType, UserWithCertificatesType } from 'components/templates/users/types'
import { ENDPOINT_ACCOUNT } from 'constants/endpoints'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { wrapper } from 'store'
import { clearBreadCrumbs, setBreadCrumbs } from 'store/breadCrumbsSlice'
import { userSelector } from 'store/userSlice'
import axiosApi from 'utils/axios'
import { getServerErrorResponse } from 'utils/serverData'

const Profile = () => {
  const user = useSelector(userSelector)
  const [certificates, setCertificates] = useState<CertificateType[]>()
  const [success, setSuccess] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (user.authorized) {
      axiosApi.get(`${ENDPOINT_ACCOUNT}/CurrentUserInfo`)
        .then(res => {
          setCertificates((res.data as UserWithCertificatesType).certificates)
          setSuccess(true)
        })
        .catch(err => {
          setSuccess(false)
          setError(getServerErrorResponse(err))
        })
    }
  }, [user])

  return (
    <>
      {user.authorized ?
        <>
          {success ?
            <>
              {certificates &&
                <ProfileTemplate
                  certificates={certificates}
                />
              }
            </>
            :
            <LoadingErrorTemplate
              error={error}
            />
          }
        </>
        :
        <UnauthorizedTemplate />
      }
    </>
  )
}

Profile.getInitialProps = wrapper.getInitialPageProps(store => () => {
  store.dispatch(clearBreadCrumbs())
})

export default Profile