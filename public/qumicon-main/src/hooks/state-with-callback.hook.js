import {useCallback, useEffect, useRef, useState} from "react";

export const useStateWithCallback = initialState => {
    const [state, setState] = useState(initialState)
    const cbRef = useRef(null)

    const updateState = useCallback((newState, callback = () => {}) => {
        console.log('update state', newState)
        cbRef.current = callback
        setState(prev => typeof newState === 'function' ? newState(prev) : newState)
    }, [])

    useEffect(() => {
        if (cbRef.current) {
            console.log('with callback', state)
            cbRef.current(state)
            cbRef.current = null
        }
    }, [state])

    return [state, updateState]
}