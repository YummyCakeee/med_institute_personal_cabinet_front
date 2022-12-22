import EducationalProgramsTemplate from 'components/templates/educationalPrograms'
import { ProgramType } from 'components/templates/educationalPrograms/types'
import LoadingErrorTemplate from 'components/templates/loadingError'
import { ENDPOINT_EDUCATIONAL_PROGRAMS } from 'constants/endpoints'
import axiosApi from 'utils/axios'

type EducationalProgramsPageProps = {
  success: boolean,
  error: string,
  educationalPrograms: ProgramType[]
}

const EducationalPrograms = ({
  success,
  error,
  educationalPrograms
}: EducationalProgramsPageProps) => {
  return (
    <>
      {success ?
        <EducationalProgramsTemplate
          educationalPrograms={educationalPrograms}
        /> :
        <LoadingErrorTemplate
          error={error}
        />
      }
    </>
  )
}

export async function getServerSideProps() {
  const pageProps: EducationalProgramsPageProps = {
    success: true,
    error: "",
    educationalPrograms: []
  }

  await axiosApi.get(ENDPOINT_EDUCATIONAL_PROGRAMS)
    .then(res => {
      pageProps.educationalPrograms = res.data
    })
    .catch(err => {
      pageProps.error = err.code
      pageProps.success = false
    })

  return {
    props: pageProps
  }
}

export default EducationalPrograms