import ProfileTemplate from 'components/templates/profile'
import UnauthorizedTemplate from 'components/templates/unauthorized'
import { useSelector } from 'react-redux'
import { userSelector } from 'store/userSlice'

const Profile = () => {
  const user = useSelector(userSelector)
  return (
    <>
      {user.authorized ?
        <ProfileTemplate /> :
        <UnauthorizedTemplate />
      }
    </>
  )
}

export default Profile