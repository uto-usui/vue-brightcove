import videojs from 'video.js'

export type PlayerType = videojs.Player & HTMLIFrameElement

export interface BrightcovePlayerProps extends videojs.PlayerOptions {
  accountId: number
  playerId: string
  embedId: string
  videoId: number
  refNode: Element
  refNodeInsert?: string
  adConfigId?: string
  applicationId?: string
  catalogSearch?:
    | string
    | {
        q: string
        limit: number
      }
  catalogSequence?: {
    type: string
    id: {
      q: string
      limit: number
    }
  }
  embedOptions?: {
    pip?: boolean
    playlist?: boolean
    responsive?: boolean
    tagName?: string
    unminified?: boolean
  }
  embedType?: string
  playerUrl?: string
  playlistId?: number
  playlistVideoId?: number
  options?: videojs.PlayerOptions
}

export interface PlayerVueData {
  player: PlayerType | null
}
