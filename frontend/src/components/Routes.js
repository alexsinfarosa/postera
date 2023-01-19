import React, {useEffect, useState} from 'react'
import {createUseStyles} from 'react-jss'
import Tree from 'react-d3-tree'
import json from '../routes.json'
import {useCenteredTree} from '../utils'

// create a tree from the json
// function makeTree(json) {
//   const tree = []

//   for (let i = 0; i < json.length; i++) {
//     const route = json[i]
//     const {score, molecules, reactions, disconnections} = route
//     const name = `Route-${i}`
//     const attributes = {score, molecules, disconnections}
//     const children = []

//     for (let j = 0; j < reactions.length; j++) {
//       const reaction = reactions[j]
//       const {name, target, sources, smartsTemplate} = reaction

//       children.push({
//         name: target,
//         attributes: {reactionName: name, smartsTemplate},
//         children: sources.map(source => ({name: source, children: []})),
//       })
//     }

//     tree.push({name, attributes, children})
//   }

//   return tree
// }
// const tree = makeTree(json)
// console.log(tree)

// make a tree from the json data (see above) using recursion.
// This is a bit more complicated, but it's a good exercise
function makeTree(json) {
  let tree = []
  for (let i = 0; i < json.length; i++) {
    const route = json[i]
    const {score, molecules, reactions} = route

    let name = ''
    let attributes = {score}
    if (reactions.length === 1) {
      const {target, sources} = reactions[0]
      name = target
      attributes = {
        id: i,
        ...attributes,
        reaction: {...reactions[0]},
        molecule: {...molecules.find(molecule => molecule.smiles === target)},
        smiles: molecules.map(m => m.smiles),
      }
      let children = []
      for (const source of sources) {
        const found = molecules.find(molecule => molecule.smiles === source)
        if (found) {
          children.push({
            name: source,
            attributes: {molecule: {...found}},
            children: [],
          })
        }
      }
      tree.push({name, attributes, children})
    } else {
      const reaction0 = reactions[0]
      const reaction1 = reactions[1]
      if (reaction1.sources.includes(reaction0.target)) {
        name = reaction0.target
        attributes = {
          id: i,
          ...attributes,
          reaction: {...reaction0},
          molecule: {
            ...molecules.find(molecule => molecule.smiles === reaction0.target),
          },
          smiles: molecules.map(m => m.smiles),
        }
        let children = []
        for (const source of reaction0.sources) {
          const found = molecules.find(molecule => molecule.smiles === source)
          if (found) {
            children.push({
              name: source,
              attributes: {molecule: {...found}},
              children: [],
            })
          }
        }
        tree.push({name, attributes, children})
      }
    }
  }
  return tree
}
const tree = makeTree(json)
// console.log(tree)

// use jss styling
const useRoutesStyles = createUseStyles({
  main: {
    display: 'flex',
  },
  sidebar: {flex: 1, backgroundColor: 'lightgray'},
  foundation: {
    flex: 2,
    height: '100vh',
    width: '100%',
  },
  smiles: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const containerStyles = {
  width: '100vw',
  height: '100vh',
}

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  svgs,
  classes,
}) => {
  console.log(nodeDatum)
  return (
    <foreignObject {...foreignObjectProps}>
      <button
        onClick={toggleNode}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: '#0e7490',
          width: 200,
          height: 340,
          border: '1px solid #0284c7',
          borderRadius: 8,
          padding: 10,
          color: '#f0f9ff',
          fontSize: 16,
          cursor: 'inherit',
        }}
      >
        <header style={{margin: '4px 0'}}>Header</header>
        <section
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
            overflow: 'auto',
            margin: '2px 0',
            backgroundColor: 'white',
            borderRadius: 8,
            width: '100%',
            color: '#0c4a6e',
          }}
        >
          {svgs && (
            <span
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              dangerouslySetInnerHTML={{
                __html: svgs[nodeDatum.name],
              }}
            />
          )}
        </section>

        <footer
          style={{
            flex: 1,
            margin: '2px 0',
            overflow: 'auto',
            width: '100%',
          }}
        >
          <p
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              padding: '0 4px',
            }}
          >
            {nodeDatum.name}
          </p>
        </footer>
      </button>
    </foreignObject>
  )
}

export const Routes = () => {
  const nodeSize = {x: 300, y: 450}
  const separation = {siblings: 1, nonSiblings: 2}
  const foreignObjectProps = {width: nodeSize.x, height: nodeSize.y, x: -100}
  const [dimensions, translate, containerRef] = useCenteredTree()
  const styles = useRoutesStyles()
  const [routes, setRoutes] = useState([])
  const [routeId, setRouteId] = useState(0)
  const route = tree.find(route => route.attributes.id === routeId)
  console.log(route)

  const [svgs, setSvgs] = useState(null)
  console.log(svgs)

  const fetchRoutes = async () => {
    const response = await fetch('http://localhost:8000/routes')
    // If using VSCode + windows, try using your IP
    // instead (see frontent terminal)
    //const response = await fetch("http://X.X.X.X:8000/routes");
    const newRoutes = await response.json()
    // console.log(newRoutes.data)
    setRoutes(newRoutes.data)
  }

  const fetchSvgs = async route => {
    const smiles = route.attributes.smiles
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
      <div className={styles.sidebar}>
        <h1>Molecules</h1>
        <ul>
          {tree.map((route, i) => (
            <li key={i}>
              <button type="button" onClick={() => setRouteId(i)}>
                {route.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.foundation}>
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
          ref={containerRef}
        >
          <Tree
            data={route}
            translate={translate}
            dimensions={dimensions}
            nodeSize={nodeSize}
            separation={separation}
            transitionDuration="1000"
            pathFunc="step"
            renderCustomNodeElement={rd3tProps =>
              renderForeignObjectNode({
                ...rd3tProps,
                foreignObjectProps,
                svgs,
              })
            }
            orientation="vertical"
          />
        </div>
      </div>
    </main>
  )
}
