import React, { Fragment } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import Video from '../components/video'

const H1 = styled.div`
  color: red;
`

const videoWrapper = css`
  ${tw(['bg-black', 'relative', 'w-screen'])};
`

function IndexPage() {
  return (
    <Fragment>
      <H1
        css={css`
          color: green;
        `}
      >
        Poop
      </H1>
      <div css={videoWrapper}>
        <Video />
      </div>
    </Fragment>
  )
}

export default IndexPage
