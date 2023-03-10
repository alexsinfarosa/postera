import React from 'react'
import {render} from 'react-dom'
import {createUseStyles} from 'react-jss'
import {Routes} from './components'

const useGlobalStyles = createUseStyles({
  '@global': {
    '*, *::before, *::after': {boxSizing: 'border-box'},
    '*': {margin: '0'},
    'html, body': {height: '100%'},
    body: {lineHeight: 1.5, WebkitFontSmoothing: 'antialiased'},
    'img, picture, video, canvas, svg': {display: 'block', maxWidth: '100%'},
    'input, button, textarea, select': {font: 'inherit'},
    'p, h1, h2, h3, h4, h5, h6': {overflowWrap: 'break-word'},
    'ul, ol': {padding: '0', margin: 0, listStyle: 'none'},
  },
})
function App() {
  useGlobalStyles()
  return (
    <main>
      <Routes />
    </main>
  )
}

const rootElement = document.getElementById('root')
render(<App />, rootElement)
