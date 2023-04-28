// Start screen sharing click handler
import Janus from "./janus.js";
import {Subject} from "@microsoft/signalr";
import {useClientMethod} from "../hooks/hub-client-method.hook.js";

function startScreenSharing() {
    // If somebody's about to share screen
    if (!canShareScreen) {
        antMessage.warning("You can't share screen while other publisher is sharing")
        return
    }

    // Get display media
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
    }).then(stream => {
        if (!canShareScreen) {
            antMessage.error("You're late")
            Janus.stopAllTracks(stream)
            return
        }
        // Get video track
        const track = stream.getVideoTracks()[0]

        // Update state
        setSelfSharingTrack(track.id)
        setCanShareScreen(false)

        // Notify other participant that I have been started screen sharing
        const group = 'screen-' + room.id
        startedSharingScreen(group, self.current.id, self.current.room)

        // Create subject
        const subject = new Subject()
        sendVideoData(subject)

        // Canvas to copy video stream
        let canvas = document.getElementById("copy-canvas")
        if (!canvas) {
            canvas = document.createElement("canvas")
            canvas.id = "copy-canvas"
            canvas.width = 1280
            canvas.height = 720
        }
        const context = canvas.getContext('2d')

        // Interval that copies video stream to canvas
        const drawInterval = setInterval(() => {
            if (mediaElements.current[self.current.id].node[types.screen]) {
                context.drawImage(mediaElements.current[self.current.id].node[types.screen], 0, 0, canvas.width, canvas.height)
                const ab64 = canvas.toDataURL("image/jpeg", 0.75)

                console.log(ab64)

                // Split data if it's longer than limit
                if (ab64.length <= segmentLimit) {
                    subject.next({index: 0, part: ab64, group});
                } else {
                    for (let i = 0, ii = 0; i < ab64.length; i += segmentLimit, ii++) {
                        subject.next({index: ii, part: ab64.substring(i, i + segmentLimit), group});
                    }
                }
            }
        }, 40)

        // If I have stopped sharing the screen manually
        track.onended = () => {
            // Update state
            setCanShareScreen(true)
            setSelfSharingTrack(null)

            // Complete stream and clear interval
            subject.complete()
            clearInterval(drawInterval)

            // Notify other participants that I have been stopped screen sharing
            stoppedSharingScreen()
        }

        // Save stream
        mediaElements.current[self.current.id].track[track.id] = stream
        //
        // Attach local media stream
        const interval = setInterval(() => {
            if (mediaElements.current[self.current.id].node[types.screen]) {
                clearInterval(interval)
                Janus.attachMediaStream(mediaElements.current[self.current.id].node[types.screen], stream)
            }
        }, 100)
    }).catch(reason => {
        console.log('reason', reason)
    })
}

// Stop screen sharing manually
function stopScreenSharing() {
    // Check if self sharing track was set
    if (!selfSharingTrack) {
        antMessage.error("Track id was not set, please rejoin the room")
        console.error('Track id was not set')
        return
    }

    // Get stream
    const stream = mediaElements.current[self.current.id].track[selfSharingTrack]
    if (!stream) {
        antMessage.error("Can't get stream, please rejoin the room")
        console.error('Stream was not set')
        return
    }

    // Stop tracks and fire onended event on the 0'st video track
    Janus.stopAllTracks(stream)
    stream.getVideoTracks()[0].dispatchEvent(new Event('ended'))
}

// Update screen publisher
useClientMethod(clientMethods.updateScreenSharingPublisher, (group, publisherId) => {
    // Update state
    setCanShareScreen(false)
    setShareGroup(group)

    // Check if publisher exists
    const index = publishers.findIndex(pub => pub.id === publisherId)
    if (index === -1) {
        antMessage.error("Publisher's absent. Please rejoin the room")
        return
    }

    // Update publishers
    let _publishers = publishers
    _publishers.splice(index, 1, {
        ..._publishers[index],
        screen: true,
    })
    setPublishers([..._publishers])
})

// Receive video data
useClientMethod(clientMethods.receiveVideoData, (index, part) => {
    if (part.length === 0) {
        return
    }

    console.log('index', index, part)

    // if (!playing && index !== 0) {
    //     return
    // }
    // playing = true

    // if (lastIndex >= r.index) {
    //     base64js.toByteArray()
    //     const ba = base64js.toByteArray(partBuffer.reduce((a, b) => a + b))
    //     channel.push(ba.buffer)
    //     partBuffer = []
    // }
    //
    // partBuffer.push(r.part)
    //
    // lastIndex = r.index
})

// When screen sharing was stopped
useClientMethod("SharingWasStopped", () => {
    setCanShareScreen(true)
    setShareGroup("")
})