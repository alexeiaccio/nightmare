import React from 'react'
import { Player, ControlBar } from 'video-react'

const Video = () => (
  <Player
    playsInline
    autoPlay
    src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
  >
    <ControlBar autoHide disableDefaultControls />
  </Player>
)

export default Video
