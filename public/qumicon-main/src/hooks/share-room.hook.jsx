import {useContext, useState} from "react";
import {App, Input, Modal} from "antd";
import {RoomContext} from "../contexts/RoomContext.js";
import {useStateWithCallback} from "./state-with-callback.hook.js";

export function useShareRoom() {
    const [shareModalOpen, setShareModalOpen] = useState(false)
    const {room, shareLink} = useContext(RoomContext)
    const [roomIdToShare, setRoomIdToShare] = useStateWithCallback(room?.id || null)
    const {message} = App.useApp()

    const ShareRoomModal = () => <Modal
        title="Share room"
        open={shareModalOpen}
        centered
        onCancel={() => setShareModalOpen(!shareModalOpen)}
        closable
        footer={null}
    >
        <div className="mb-3">Copy link and share</div>
        <Input
            readOnly
            value={shareLink(roomIdToShare)}
            addonAfter={<a
                onClick={(e) => {
                    e.preventDefault()
                    navigator.clipboard.writeText(shareLink(roomIdToShare))
                    message.info("Link was copied to your clipboard")
                }}
            >
                Copy
            </a>}
        />
    </Modal>

    return {
        ShareRoomModal,
        shareModalOpen,
        setShareModalOpen,
        setRoomIdToShare,
    }
}