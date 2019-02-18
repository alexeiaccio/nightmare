import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import Video from '../components/video'

const H1 = styled.div`
  color: red;
`

const videoWrapper = css`
  ${tw(['bg-black', 'w-screen'])};
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

IndexPage.propTypes = {
  data: PropTypes.shape({
    about: PropTypes.object.isRequired,
  }).isRequired,
}

export default IndexPage
