import React from 'react'
import PropTypes from 'prop-types'
import { Player, ControlBar } from 'video-react'
import { StaticQuery, graphql } from 'gatsby'
import { propPathOr, mapProps, map, compose } from 'crocks'

function Video({ rows }) {
  const toTime = time => time.split(':').reduce((acc, x) => 60 * acc + +x)
  const timeline = compose(
    map(mapProps({ time: toTime })),
    map(propPathOr({}, ['node'])),
    propPathOr([], ['edges'])
  )(rows)
  console.log(timeline)
  return (
    <Player
      playsInline
      autoPlay
      src="https://275501.selcdn.ru/Video/upload/nightmare.mp4"
    >
      <ControlBar autoHide disableDefaultControls />
    </Player>
  )
}

Video.propTypes = {
  rows: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }).isRequired,
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
                type
              }
            }
          }
        }
      `}
      render={({ rows }) => <Video rows={rows} />}
    />
  )
}

export default WithStaticQuery
