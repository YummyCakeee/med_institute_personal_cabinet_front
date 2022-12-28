import ProfileTemplate from 'components/templates/profile'

const Profile = ({ certificates }) => {
  return (
    <div>
      <ProfileTemplate />
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      certificates: [
        {
          title: "1"
        }
      ]
    }
  }
}

export default Profile