import EducationalProgramsTemplate from 'components/templates/educationalPrograms'
import { ProgramType } from 'components/templates/educationalPrograms/types'
import LoadingErrorTemplate from 'components/templates/loadingError'
import UnauthorizedTemplate from 'components/templates/unauthorized'
import { UserRoleType } from 'components/templates/users/types'
import { ENDPOINT_PROGRAMS } from 'constants/endpoints'
import { ROUTE_PROFILE } from 'constants/routes'
import router from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { wrapper } from 'store'
import { clearBreadCrumbs } from 'store/breadCrumbsSlice'
import { userSelector } from 'store/userSlice'
import axiosApi from 'utils/axios'
import { getServerErrorResponse } from 'utils/serverData'

const EducationalPrograms = () => {

  const user = useSelector(userSelector)
  const [educationalPrograms, setEducationalPrograms] = useState<ProgramType[]>([])
  const [success, setSuccess] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (user.authorized) {
      if (!user.roles?.includes(UserRoleType.ADMINISTRATOR) && !user.roles?.includes(UserRoleType.TEACHER)) {
        router.replace(ROUTE_PROFILE)
        return
    }
      axiosApi.get(ENDPOINT_PROGRAMS)
        .then(res => {
          setSuccess(true)
          setEducationalPrograms(res.data)
        })
        .catch(err => {
          setSuccess(false)
          setError(getServerErrorResponse(err))
        })
    }
  }, [user.authorized])


  return (
    <>
      {user.authorized ?
        <>
          {success ?
            <EducationalProgramsTemplate
              educationalPrograms={educationalPrograms}
            />
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

EducationalPrograms.getInitialProps = wrapper.getInitialPageProps(store => () => {
  store.dispatch(clearBreadCrumbs())
})

export default EducationalPrograms