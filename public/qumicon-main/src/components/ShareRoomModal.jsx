import {App, Input, Modal} from "antd";

export const ShareRoomModal = ({shareModalOpen, setShareModalOpen, shareLink}) => {
    const {message} = App.useApp()

    return <Modal
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
            value={shareLink}
            addonAfter={<a
                onClick={(e) => {
                    e.preventDefault()
                    navigator.clipboard.writeText(shareLink)
                    message.info("Link was copied to your clipboard")
                }}
            >
                Copy
            </a>}
        />
    </Modal>
}