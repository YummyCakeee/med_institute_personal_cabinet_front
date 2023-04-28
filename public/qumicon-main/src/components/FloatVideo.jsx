import React from "react";
import {useJanusConsts} from "../hooks/janus-consts.hook.js";

export default function FloatVideo({id, provideMediaRef, muted}) {
    const {types} = useJanusConsts()

    return (
        <video
            id={id}
            ref={instance => {
                provideMediaRef(id, types.video, instance)
            }}
            className={"bg-black duration-200 right-10 bottom-24 absolute rounded-xl " + (muted ? "hidden" : "")}
            autoPlay
            width={320}
            height={240}
        />
    )
}