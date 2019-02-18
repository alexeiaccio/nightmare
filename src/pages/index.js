import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

const H1 = styled.div`
  color: red;
`

function IndexPage() {
  return (
    <Fragment>
      <H1
        css={css`
          color: green;
        `}
      >Poop</H1>
    </Fragment>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    homepage: PropTypes.object.isRequired,
  }).isRequired,
}

export default IndexPage

