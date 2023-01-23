import React, {useEffect, useState} from 'react'
import {createUseStyles} from 'react-jss'
import {RouteTree} from './RouteTree'
import {Header} from './Header'
import {MoleculeList} from './MoleculeList'

// use jss styling
const useRoutesStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    padding: 16,
    width: '25%',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#f8fafc',
  },
  route: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    color: '#475569',
    fontWeight: 700,
  },
})

export const Routes = () => {
  const styles = useRoutesStyles()
  const [routes, setRoutes] = useState([])
  const [routesError, setRoutesError] = useState(null)
  const [routeId, setRouteId] = useState(1)
  const route = routes.find(route => route.attributes.id === routeId)
  const [svgs, setSvgs] = useState(null)
  const [svgsError, setSvgsError] = useState(null)

  const molecules = []
  routes.forEach(route => {
    route.attributes.molecules.forEach(mol => {
      if (!molecules.includes(mol.smiles)) {
        molecules.push(mol.smiles)
      }
    })
  })

  const moleculesRoutes = {}
  molecules.forEach(mol => {
    moleculesRoutes[mol] = []
  })
  routes.forEach(route => {
    route.attributes.molecules.forEach(mol => {
      moleculesRoutes[mol.smiles].push(route.attributes.id)
    })
  })

  const fetchRoutes = async () => {
    const response = await fetch('http://localhost:8000/routes')
    if (!response.ok) {
      setRoutesError('Unable to fetch routes')
      return
    }

    const newRoutes = await response.json()
    setRoutes(newRoutes.data.children)
  }

  const fetchSvgs = async route => {
    const smiles = route.attributes?.molecules.map(mol => mol.smiles)
    const urls = smiles.map(
      smile => `http://localhost:8000/molecule?smiles=${smile}`,
    )
    const responses = await Promise.allSettled(urls.map(url => fetch(url)))

    const errors = responses.filter(res => res.status === 'rejected')
    if (errors.length > 0) {
      console.error(errors)
      setSvgsError('Unable to fetch molecule images')
      return
    }

    const jsons = await Promise.all(responses.map(res => res.value.json()))

    let svgs = {}
    jsons.forEach((json, i) => (svgs[smiles[i]] = json.data.body))
    setSvgs(svgs)
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  useEffect(() => {
    if (route) {
      fetchSvgs(route)
    }
  }, [route])

  // TODO: use react-d3-tree to visualize the routes
  //   - https://www.npmjs.com/package/react-d3-tree
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.header}>Shared Molecules</h2>
        {svgs ? (
          <MoleculeList
            svgs={svgs}
            route={route}
            moleculesRoutes={moleculesRoutes}
          ></MoleculeList>
        ) : (
          <h2 className={styles.header} id="svgsError">
            {svgsError}
          </h2>
        )}
      </aside>

      {route ? (
        <div className={styles.main}>
          <Header
            routes={routes}
            route={route}
            routeId={routeId}
            setRouteId={setRouteId}
          ></Header>
          <section className={styles.route}>
            <RouteTree route={route} svgs={svgs}></RouteTree>
          </section>
        </div>
      ) : (
        <div className={styles.main}>
          <header style={{padding: 16}}>
            <h2 className={styles.header}>{routesError}</h2>
          </header>
        </div>
      )}
    </div>
  )
}
