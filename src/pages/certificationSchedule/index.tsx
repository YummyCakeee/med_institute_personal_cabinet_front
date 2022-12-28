import CertificationScheduleTemplate from "components/templates/certificationSchedule"
import LoadingErrorTemplate from "components/templates/loadingError"


type CertificationSchedulePageProps = {
    success: boolean,
    error: string
}

const CertificationSchedule = ({
    success,
    error
}: CertificationSchedulePageProps) => {

    return (
        <>
            {success ?
                <CertificationScheduleTemplate /> :
                <LoadingErrorTemplate
                    error={error}
                />
            }
        </>
    )

}


export default CertificationSchedule