import React, { memo } from 'react'
import { css } from '@emotion/core'
import YouTube from 'react-youtube'

function Sound() {
  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      disablekb: 1,
      controls: 0,
      loop: 1,
      version: 3,
      showinfo: 0,
      rel: 0,
      origin: 'https://nightmare.accio.pro',
      playlist: 'nxEpuDo5s3o',
    },
  }

  const handleReady = e => {
    e.target.playVideo()
  }

  return (
    <div
      css={css`
        ${tw(['absolute', 'pin-l', 'w-full'])};
        pointer-events: none;
        height: 300%;
        top: -100%;
      `}
    >
      <div
        css={css`
          &,
          & .video,
          & iframe {
            ${tw(['absolute', 'h-full', 'pin-l', 'pin-t', 'w-full'])};
            pointer-events: none;
            z-index: -1;
          }
        `}
      >
        <YouTube
          videoId="nxEpuDo5s3o"
          className="video"
          opts={opts}
          onReady={handleReady}
        />
      </div>
    </div>
  )
}

export default memo(Sound)
