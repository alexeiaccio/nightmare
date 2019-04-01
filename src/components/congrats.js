import React from 'react'
import PropTypes from 'prop-types'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { css } from '@emotion/core'
import { Link } from 'gatsby'

function Congrats({ result }) {
  const { width, height } = useWindowSize()

  return (
    <>
      <div
        css={css`
          ${tw(['absolute', 'bg-black', 'opacity-75', 'pin'])};
        `}
      />
      <Confetti
        height={height}
        gravity={0.01}
        opacity={0.2}
        numberOfPieces={1500}
        width={width}
      />
      <div
        css={css`
          ${tw([
            'absolute',
            'flex',
            'items-center',
            'jusify-center',
            'overflow-y-scroll',
            'pin',
            'text-white',
            'z-10',
          ])};
        `}
      >
        <div
          css={css`
            ${tw([
              'bg-black',
              'max-w-md',
              'my-q48',
              'mx-auto',
              'p-q24',
              'relative',
              'text-center',
              'w-full',
            ])};
            & a {
              ${tw(['text-white', 'hover:no-underline'])}
            }
          `}
        >
          <h1>Congrats!</h1>
          <p>
            {"You've typed: "}
            <b>{result.join('')}</b>
          </p>
          <Link to={`/?again=${new Date()}`}>Again, please</Link>
          &emsp;
          <Link to="/about">What was it?</Link>
        </div>
      </div>
    </>
  )
}

Congrats.propTypes = {
  result: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Congrats
