import React from "react"
import UserTemplate from "components/templates/users/UserTemplate"

const Users = ({ user }) => {
    return (
        <UserTemplate
            {...{ user }}
        />
    )
}

export async function getServerSideProps({ params }) {
    const user = {
        surname: "Иванов",
        name: "Иван",
        patronymic: "Иванович",
        login: "shrek_boy",
        email: "humanoidhuman@mail.com",
        roles: ["student", "teacher"]
    }
    return {
        props: {
            user
        }
    }
}

export default Users