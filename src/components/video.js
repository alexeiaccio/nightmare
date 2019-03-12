import React, { memo, Component, useRef } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { propPathOr, mapProps, map, compose, assoc, reduce } from 'crocks'
import { css } from '@emotion/core'
import YouTube from 'react-youtube'

class Video extends Component {
  static propTypes = {
    timeline: PropTypes.objectOf(PropTypes.string).isRequired,
  }

  constructor() {
    super()
    this.videoRef = null
    this.state = {
      canPlay: null,
      currentAction: null,
      paused: false,
      prevTime: null,
      suspend: false,
    }
  }

  componentDidMount() {
    if (document !== undefined) {
      document.addEventListener('keyup', this.handleKey)
    }
  }

  shouldComponentUpdate(_, prevState) {
    if (prevState !== this.state) return true
    return false
  }

  componentWillUnmount() {
    if (document !== undefined) {
      document.removeEventListener('keyup', this.handleKey)
    }
  }

  handleStateChange = ({ target }) => {
    const playerCurrentTime = target.getCurrentTime()
    const {
      currentAction: stateCurrentAction,
      currentTime: stateCurrentTime,
      prevTime,
      paused,
    } = this.state

    let currentTime = stateCurrentTime
    let currentAction = stateCurrentAction
    const roundedCurrentTime = Math.floor(playerCurrentTime)

    if (stateCurrentTime !== roundedCurrentTime) {
      currentTime = roundedCurrentTime
      const action = propPathOr(
        null,
        ['timeline', currentTime.toString()],
        this.props
      )

      if (action) {
        if ((action === 'click' || action === 'typing') && !paused) {
          console.log('pause me')
          target.pauseVideo()
          this.pause()
        }
        if (action === 'idle' && paused) target.playVideo()
        if (currentAction !== action) {
          currentAction = action
        }
      }

      if (prevTime) {
        this.pause()
      }

      this.setState({
        currentAction,
        currentTime,
        paused,
        prevTime: null,
      })
    }
  }

  play = () => {
    if (this.videoRef) {
      this.videoRef.playVideo()
    }
  }

  pause = () => {
    if (this.videoRef) {
      this.videoRef.pauseVideo()
    }
  }

  handleLoadStart = () => {
    console.log('handleLoadStart')
  }

  handleSuspend = () => {
    this.setState({ suspend: true })
  }

  handleCanPlay = () => {
    this.setState({ canPlay: true })
  }

  handlePlay = ({ target }) => {
    console.log('handlePlay')
    this.setState({ paused: false })
  }

  handlePause = ({ target }) => {
    console.log('handlePause')
    this.setState({ paused: true })
  }

  handleLoadedData = () => {
    console.log('handleLoadedData')
  }

  getProperties(video) {
    if (!video) {
      return null
    }

    return mediaProperties.reduce((properties, key) => {
      properties[key] = video[key]
      return properties
    }, {})
  }

  togglePlay = () => {
    const { paused } = this.state
    if (paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  handleClick = e => {
    e.preventDefault()
    const { canPlay, currentAction, paused } = this.state
    if (canPlay) {
      this.play()
      this.setState({ canPlay: false })
    } else if (currentAction === 'click' && paused) {
      console.log('click')
      this.play()
    }
  }

  handleKey = e => {
    e.preventDefault()
    const { currentAction, currentTime, paused } = this.state
    if (currentAction === 'typing' && paused) {
      console.log('keyup')
      this.play()
      this.setState({ prevTime: Math.floor(currentTime) })
    }
  }

  _onReady = e => {
    this.videoRef = e.target
    e.target.pauseVideo()
    this.setState({ canPlay: true })
  }

  handleChange = e => {
    if (e.data === 1) {
      setInterval(() => this.handleStateChange(e), 500)
    }
  }

  render() {
    const { canPlay } = this.state
    const opts = {
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        disablekb: 1,
        // controls: 0,
        loop: 1,
        version: 3,
        showinfo: 0,
        rel: 0,
      },
    }

    return (
      <>
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
              }
            `}
          >
            <YouTube
              videoId="zHIeemAIRxM"
              className="video"
              opts={opts}
              onReady={this._onReady}
              onPlay={this.handlePlay}
              onPause={this.handlePause}
              onStateChange={this.handleChange}
            />
          </div>
        </div>
        <div
          css={css`
            ${tw([
              'absolute',
              'bg-black',
              'cursor-pointer',
              'items-center',
              'justify-center',
              'opacity-50',
              'pin',
              'text-white',
              'text-5xl',
              'hover:opacity-75',
            ])};
            ${canPlay > 0 ? tw('flex') : tw('hidden')};
          `}
          onClick={this.handleClick}
        >
          Start
        </div>
      </>
    )
  }
}

function WithStaticQuery() {
  return (
    <StaticQuery
      query={graphql`
        query VideoQuery {
          rows: allGoogleSheetRow {
            edges {
              node {
                time
                action
              }
            }
          }
        }
      `}
      render={({ rows }) => {
        const toTime = time =>
          parseInt(time.split(':').reduce((acc, x) => 60 * acc + +x), 10)
        const toObj = (acc, { time, action }) =>
          assoc(time.toString(), action, acc)
        const timeline = compose(
          reduce(toObj, {}),
          map(mapProps({ time: toTime })),
          map(propPathOr({}, ['node'])),
          propPathOr([], ['edges'])
        )(rows)
        return <Video timeline={timeline} />
      }}
    />
  )
}

export default memo(WithStaticQuery)
