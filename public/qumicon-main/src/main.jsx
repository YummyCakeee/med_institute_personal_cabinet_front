import React from 'react'
import ReactDOM from 'react-dom/client'
import Application from './Application.jsx'
import './index.css'
import {App} from "antd";

document.addEventListener("DOMContentLoaded", function () {
    const videoroom = document.createElement('div')
    videoroom.id = "videoroom"

    document.querySelector('body').appendChild(videoroom)

    ReactDOM.createRoot(videoroom).render(
        <React.Fragment>
            <App>
                <Application/>
            </App>
        </React.Fragment>
    )
})