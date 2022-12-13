import ProfileTemplate from 'components/templates/profile'

const Profile = ({ certificates }) => {
  console.log(certificates)
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