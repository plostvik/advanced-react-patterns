// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
import {Switch} from '../switch'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const toggleActionTypes = {
  TOGGLE: 'TOGGLE',
  RESET: 'ON',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case toggleActionTypes.TOGGLE: {
      return {on: !state.on}
    }
    case toggleActionTypes.RESET: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  const toggle = () => dispatch({type: toggleActionTypes.TOGGLE})
  const reset = () => dispatch({type: toggleActionTypes.RESET, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

// export {useToggle, toggleReducer, toggleActionTypes}

// import {useToggle, toggleReducer, toggleActionTypes} from './use-toggle'

function App() {
  const [timesClicked, setTimesClicked] = React.useState(0)
  const clickedTooMuch = timesClicked >= 4

  function toggleStateReducer(state, action) {
    if (action.type === toggleActionTypes.TOGGLE && timesClicked >= 4) {
      return {on: state.on}
    }
    return toggleReducer(state, action)
  }

  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleStateReducer,
  })

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
