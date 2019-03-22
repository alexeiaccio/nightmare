import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { Global, css } from '@emotion/core'

import Seo from '../components/seo'
import Sound from '../components/sound'
import Video from '../components/video'

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
  }
`

const wrapper = css`
  ${tw([
    'absolute',
    'bg-black',
    'flex',
    'items-center',
    'justify-center',
    'overflow-hidden',
    'pin',
  ])};
`

function IndexPage({ location }) {
  return (
    <Fragment>
      <Global styles={globalStyles} />
      <Seo pathname={location.pathname} />
      <div css={wrapper}>
        <Sound />
        <Video location={location} />
      </div>
    </Fragment>
  )
}

IndexPage.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default IndexPage
