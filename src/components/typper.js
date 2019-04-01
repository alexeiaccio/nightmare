import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { css } from '@emotion/core'

function Typper({ onKeyEvent }) {
  const keyRef = useRef(null)
  useEffect(() => {
    if (keyRef.current && keyRef.current.focus) {
      keyRef.current.focus()
    }
  }, [])

  return (
    <input
      css={css`
        ${tw([
          'absolute',
          'block',
          'h-full',
          'opacity-0',
          'pin-l',
          'pin-t',
          'w-full',
        ])};
      `}
      onKeyUp={onKeyEvent}
      ref={keyRef}
    />
  )
}

Typper.propTypes = {
  onKeyEvent: PropTypes.func.isRequired,
}

export default Typper
