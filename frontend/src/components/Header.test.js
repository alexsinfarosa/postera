import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {Header} from './Header'
import userEvent from '@testing-library/user-event'

test('header renders with route name', () => {
  const routes = [
    {name: 'Route 1', attributes: {id: 1}, children: []},
    {name: 'Route 2', attributes: {id: 2}, children: []},
  ]
  const route = routes[0]
  const routeId = 1
  const setRouteId = jest.fn()

  render(
    <Header
      routes={routes}
      route={route}
      routeId={routeId}
      setRouteId={setRouteId}
    />,
  )

  expect(screen.getByText('Route 1')).toBeInTheDocument()
})

// write a test to assert that the next button is incrementing the routeId

test('next route button increments routeId', () => {
  const routes = [
    {name: 'Route 1', attributes: {id: 1}, children: []},
    {name: 'Route 2', attributes: {id: 2}, children: []},
  ]
  const route = routes[0]
  const routeId = 1
  const setRouteId = jest.fn()

  render(
    <Header
      routes={routes}
      route={route}
      routeId={routeId}
      setRouteId={setRouteId}
    />,
  )

  userEvent.click(screen.getByLabelText('next route'))
  expect(setRouteId).toHaveBeenCalledWith(2)
})

// write a test to assert that the previous button is decrementing the routeId
test('previous route button decrements routeId', () => {
  const routes = [
    {name: 'Route 1', attributes: {id: 1}, children: []},
    {name: 'Route 2', attributes: {id: 2}, children: []},
  ]
  const route = routes[1]
  const routeId = 2
  const setRouteId = jest.fn()

  render(
    <Header
      routes={routes}
      route={route}
      routeId={routeId}
      setRouteId={setRouteId}
    />,
  )

  userEvent.click(screen.getByLabelText('previous route'))
  expect(setRouteId).toHaveBeenCalledWith(1)
})

// write a test to assert that the previous button is disabled when the routeId is 1
test('previous route button is disabled when routeId is 1', () => {
  const routes = [
    {name: 'Route 1', attributes: {id: 1}, children: []},
    {name: 'Route 2', attributes: {id: 2}, children: []},
  ]
  const route = routes[0]
  const routeId = 1
  const setRouteId = jest.fn()

  render(
    <Header
      routes={routes}
      route={route}
      routeId={routeId}
      setRouteId={setRouteId}
    />,
  )

  expect(screen.getByLabelText('previous route')).toBeDisabled()
})

// write a test to assert that the next button is disabled when the routeId is the last route
test('next route button is disabled when routeId is the last route', () => {
  const routes = [
    {name: 'Route 1', attributes: {id: 1}, children: []},
    {name: 'Route 2', attributes: {id: 2}, children: []},
  ]
  const route = routes[1]
  const routeId = 2
  const setRouteId = jest.fn()

  render(
    <Header
      routes={routes}
      route={route}
      routeId={routeId}
      setRouteId={setRouteId}
    />,
  )

  expect(screen.getByLabelText('next route')).toBeDisabled()
})
