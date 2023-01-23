import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {MoleculeList} from './MoleculeList'

test('the molecule list renders', () => {
  const routes = [
    {name: 'Route 1', attributes: {id: 1}, children: []},
    {name: 'Route 2', attributes: {id: 2}, children: []},
  ]
  const route = routes[0]
  const smiles = 'COC(=O)Cn1nnc2ccccc21'
  const moleculesRoutes = {
    'COC(=O)Cn1nnc2ccccc21': [4, 5, 15, 23],
    'ClCNc1ccc(Cl)cc1': [6, 7],
  }
  const svgs = {
    'COC(=O)Cn1nnc2ccccc21': `<svg width="400" height="110">
    <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
    Rectangle
  </svg>`,
  }

  render(
    <MoleculeList
      svgs={svgs}
      route={route}
      moleculesRoutes={moleculesRoutes}
    />,
  )

  expect(screen.getByText(smiles)).toBeInTheDocument()
  expect(screen.getByText('In Route: 4,5,15,23')).toBeInTheDocument()
  expect(screen.getByText('Rectangle')).toBeInTheDocument()
})
