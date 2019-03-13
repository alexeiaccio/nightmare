import React, { memo, Component } from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import { propPathOr, mapProps, map, compose, assoc, reduce } from 'crocks'
import { css } from '@emotion/core'
import YouTube from 'react-youtube'
import styled from '@emotion/styled'

const Clicker = styled.div`
  ${tw(['absolute', 'flex', 'flex-col', 'items-center', 'pin', 'text-white'])};
`

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
      prevKeyCode: null,
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
      const { timeline } = this.props
      currentTime = roundedCurrentTime
      const action = propPathOr(null, [currentTime.toString()], timeline)

      if (action) {
        if ((action === 'click' || action === 'typing') && !paused) {
          this.pause()
        }
        if (action === 'wait' && paused) {
          this.play()
        }
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

  handleCanPlay = () => {
    this.setState({ canPlay: true })
  }

  handlePlay = () => {
    this.setState({ paused: false })
  }

  handlePause = () => {
    this.setState({ paused: true })
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
      this.toggleFullScreen()
      this.play()
      this.setState({ canPlay: false })
    } else if (currentAction === 'click' && paused) {
      this.play()
    }
  }

  handleKey = e => {
    e.preventDefault()
    const { currentAction, currentTime, paused, prevKeyCode } = this.state
    if (currentAction === 'typing' && e.keyCode !== prevKeyCode && paused) {
      this.play()
      this.setState({
        prevTime: Math.floor(currentTime),
        prevKeyCode: e.keyCode,
      })
    }
  }

  handleReady = e => {
    this.videoRef = e.target
    e.target.pauseVideo()
    this.setState({ canPlay: true })
  }

  handleChange = e => {
    if (e.data === 1) {
      setInterval(() => this.handleStateChange(e), 500)
    }
  }

  handleEnd = () => {
    this.toggleFullScreen()
  }

  toggleFullScreen = () => {
    if (document !== undefined) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  render() {
    const { canPlay, currentAction } = this.state
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
              onReady={this.handleReady}
              onPlay={this.handlePlay}
              onPause={this.handlePause}
              onStateChange={this.handleChange}
              onEnd={this.handleEnd}
            />
          </div>
        </div>
        <Clicker
          css={css`
            ${currentAction === 'click'
              ? tw('cursor-pointer')
              : tw('cursor-default')};
            ${canPlay > 0
              ? tw([
                  'bg-black',
                  'justify-center',
                  'opacity-50',
                  'hover:opacity-75',
                ])
              : tw(['bg-transparent', 'justify-end'])};
          `}
          onClick={this.handleClick}
        >
          <div
            css={css`
              ${canPlay > 0
                ? tw(['cursor-pointer', 'block', 'text-5xl'])
                : tw('hidden')};
            `}
          >
            Start
          </div>
          {currentAction && (
            <div
              css={css`
                ${tw([
                  'bg-black',
                  'capitalize',
                  'mb-q12',
                  'opacity-50',
                  'p-q12',
                  'rounded-lg',
                  'text-center',
                  'text-xl',
                ])};
              `}
            >
              {currentAction}
            </div>
          )}
        </Clicker>
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
