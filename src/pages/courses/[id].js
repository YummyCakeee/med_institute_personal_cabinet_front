import CourseTemplate from "components/templates/courses/CourseTemplate"
import React from "react"

const Course = () => {


    return (
        <CourseTemplate />
    )
}

export function getServerSideProps({ params }) {



    return {
        props: {

        }
    }
}

export default Course