import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import { Global, css } from '@emotion/core'

import Sound from '../components/sound'

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
  }
`

function AboutPage({ data }) {
  const about = data.about.data
  return (
    <>
      <Global styles={globalStyles} />
      <div
        css={css`
          ${tw(['absolute', 'overflow-hidden', 'pin'])};
        `}
      >
        <Sound />
      </div>
      <div
        css={css`
          ${tw(['absolute', 'bg-black', 'opacity-75', 'pin'])};
        `}
      />
      <div
        css={css`
          ${tw(['absolute', 'overflow-y-scroll', 'pin', 'text-white'])};
        `}
      >
        <div
          css={css`
            ${tw([
              'max-w-md',
              'my-q48',
              'mx-auto',
              'p-q24',
              'relative',
              'w-full',
            ])};
            & a {
              ${tw(['text-white', 'hover:no-underline'])}
            }
          `}
        >
          <Link to="/">↩︎ Start again</Link>
          <h1>{about.title.text}</h1>
          {/* eslint-disable-next-line */}
          <div dangerouslySetInnerHTML={{ __html: about.text.html }} />
        </div>
      </div>
    </>
  )
}

AboutPage.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default AboutPage

export const pageQuery = graphql`
  query AboutQuery {
    about: prismicAbout {
      data {
        title {
          text
        }
        text {
          html
        }
      }
    }
  }
`
