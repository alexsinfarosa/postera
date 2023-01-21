import React, {useEffect, useState} from 'react'
import {createUseStyles} from 'react-jss'
import {RouteTree} from './RouteTree'
import json from '../routes.json'

function makeTree(json) {
  let trees = []

  for (let i = 0; i < json.length; i++) {
    const route = json[i]
    let tree = {
      name: '',
      attributes: {
        id: i,
        score: route.score,
        molecules: route.molecules,
        disconnections: route.disconnections,
      },
      children: [],
    }

    // case when reactions length is 1
    if (route.reactions.length === 1) {
      const reaction = route.reactions[0]
      tree.name = reaction.target
      tree.attributes = {
        ...tree.attributes,
        name: reaction.name,
        target: reaction.target,
        smartsTemplate: reaction.smartsTemplate,
      }
      tree.children = reaction.sources.map(source => ({
        name: source,
        children: [],
      }))
    }

    // case when reactions length is 2
    if (route.reactions.length === 2) {
      const reaction1 = route.reactions[0]
      const reaction2 = route.reactions[1]

      if (reaction2.sources.includes(reaction1.target)) {
        tree.name = reaction2.target
        tree.attributes = {
          ...tree.attributes,
          name: reaction2.name,
          target: reaction2.target,
          smartsTemplate: reaction2.smartsTemplate,
        }
        tree.children = reaction2.sources.map(source => {
          if (source === reaction1.target) {
            return {
              name: source,
              children: reaction1.sources.map(source => ({
                name: source,
                children: [],
              })),
            }
          } else {
            return {
              name: source,
              children: [],
            }
          }
        })
      }
    }

    trees.push(tree)
  }

  return trees
}
const tree = makeTree(json)
console.log(tree)

// use jss styling
const useRoutesStyles = createUseStyles({
  main: {
    display: 'flex',
  },
  sidebar: {
    padding: 16,
    width: 400,
    height: '100vh',
    // borderRight: '1px solid #ccc',
  },
  route: {
    width: '100%',
    height: '100vh',
    overflow: 'auto',
  },
})

export const Routes = () => {
  const styles = useRoutesStyles()
  const [routes, setRoutes] = useState([])
  const [routeId, setRouteId] = useState(15)
  const route = tree.find(route => route.attributes.id === routeId)
  const [svgs, setSvgs] = useState(null)

  const fetchRoutes = async () => {
    const response = await fetch('http://localhost:8000/routes')
    const newRoutes = await response.json()
    setRoutes(newRoutes.data)
  }

  const fetchSvgs = async route => {
    const smiles = route.attributes.molecules.map(molecule => molecule.smiles)
    const urls = smiles.map(
      smile => `http://localhost:8000/molecule?smiles=${smile}`,
    )
    const responses = await Promise.all(urls.map(url => fetch(url)))
    const jsons = await Promise.all(responses.map(res => res.json()))

    let svgs = {}
    jsons.forEach((json, i) => (svgs[smiles[i]] = json.data.body))
    setSvgs(svgs)
  }

  useEffect(() => {
    fetchSvgs(route)
    fetchRoutes()
  }, [route])

  // TODO: use react-d3-tree to visualize the routes
  //   - https://www.npmjs.com/package/react-d3-tree

  return (
    <main className={styles.main}>
      <section className={styles.sidebar}>
        <h2 style={{marginBottom: 32}}>Shared Molecules</h2>
        {/* <ul>
          {tree.map((route, i) => (
            <li key={i}>
              <button type="button" onClick={() => setRouteId(i)}>
                Route {route.attributes.id + 1}
              </button>
            </li>
          ))}
        </ul> */}
        {svgs && (
          <ul>
            {Object.keys(svgs)
              .filter(smiles => smiles !== route.name)
              .map((smiles, i) => {
                return (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      // alignItems: 'center',
                      borderLeft: '2px solid #9ca3af',
                      // borderRight: '2px solid #9ca3af',
                      marginBottom: 32,
                      borderRadius: 8,
                    }}
                  >
                    <div style={{position: 'relative', padding: '2px 10px'}}>
                      <div
                        style={{
                          position: 'absolute',
                          top: 24,
                        }}
                      >
                        {smiles}
                      </div>
                      <span
                        style={{height: 160, width: 160, display: 'block'}}
                        dangerouslySetInnerHTML={{
                          __html: svgs[smiles],
                        }}
                      />

                      <div
                        style={
                          {
                            // position: 'absolute',
                            // bottom: 8,
                          }
                        }
                      >
                        <span>In Route: 1,14,16,18,34</span>
                      </div>
                    </div>
                  </li>
                )
              })}
          </ul>
        )}
      </section>
      <section className={styles.route}>
        <RouteTree route={route} svgs={svgs}></RouteTree>
      </section>
    </main>
  )
}
