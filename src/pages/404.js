import React from 'react'
import { Link } from 'gatsby'

const NotFoundPage = () => (
  <>
    <h1>404 Page Not Found</h1>
    <Link to={`/?again=${new Date()}`}>Again, please</Link>
    &emsp;
    <Link to="/about">What was it?</Link>
  </>
)

export default NotFoundPage
