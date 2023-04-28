import Janus from '../utils/janus.js';

export function useJanusConsts() {
    const server = window.qumicon_config?.janus || 'ws://localhost:8188'
    const videoRoomPlugin = 'janus.plugin.videoroom'
    const audioBridgePlugin = 'janus.plugin.audiobridge'
    const opaqueId = 'videoroom-' + Janus.randomString(12)
    const FLOAT_VIDEO = 'FLOAT_VIDEO'
    const mixedAudio = "mixedAudio"

    const feedStatus = {
        absent: "absent",
        adding: "adding",
        attached: "attached",
        added: "added",
        removing: "removing",
        stopped: "stopped"
    }

    const types = {
        audio: 'audio',
        video: 'video',
        data: 'data',
        screen: 'screen'
    }

    const defaultFeed = {
        [mixedAudio]: {
            [types.audio]: {
                node: null,
                stream: null,
                track: null,
                mid: null,
            }
        }
    }

    const defaultPlugin = {
        publisher: null,
        subscriber: null,
        presenter: null,
        audiobridge: null
    }

    const events = {
        joined: 'joined',
        attached: 'attached',
        destroyed: 'destroyed',
        event: 'event',
        talking: "talking",
        stopped_talking: "stopped-talking",
        updated: "updated"
    }

    const requests = {
        configure: 'configure',
        exists: 'exists',
        create: 'create',
        edit: 'edit',
        destroy: 'destroy',
        unpublish: 'unpublish',
        join: 'join',
        leave: 'leave',
        list: 'list',
        start: 'start',
        update: 'update',
        unsubscribe: 'unsubscribe',
    }

    const msg = {
        videoroom: 'videoroom',
        audiobridge: "audiobridge",
        publishers: 'publishers',
        unpublished: 'unpublished',
        participants: "participants",
        streams: 'streams',
        joined: 'joined',
        id: 'id',
        private_id: 'private_id',
        room: 'room',
        error: 'error',
        error_code: 'error_code',
        leaving: 'leaving',
    }

    return {
        mixedAudio,
        defaultPlugin,
        defaultFeed,
        server,
        videoRoomPlugin,
        audioBridgePlugin,
        opaqueId,
        FLOAT_VIDEO,
        feedStatus,
        types,
        events,
        msg,
        requests
    }
}