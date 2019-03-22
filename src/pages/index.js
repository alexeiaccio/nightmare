import React, { Fragment } from 'react'
import { Global, css } from '@emotion/core'

import Sound from '../components/sound'
import Video from '../components/video'

const globalStyles = css`
  * {
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

function IndexPage() {
  return (
    <Fragment>
      <Global styles={globalStyles} />
      <div css={wrapper}>
        <Sound />
        <Video />
      </div>
    </Fragment>
  )
}

export default IndexPage
