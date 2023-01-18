import React, {useEffect, useState} from 'react'
import {createUseStyles} from 'react-jss'
import Tree from 'react-d3-tree'
import json from '../routes.json'
import {useCenteredTree} from '../utils'

// create a tree from the json
function makeTree(json) {
  const tree = {name: 'root', children: []}

  for (let i = 0; i < json.length; i++) {
    const route = json[i]
    const {score, molecules, reactions, disconnections} = route
    const name = reactions[0].target
    const attributes = {score, molecules, disconnections}
    const children = []

    for (let j = 0; j < reactions.length; j++) {
      const reaction = reactions[j]
      const {name, target, sources, smartsTemplate} = reaction

      children.push({
        name: target,
        attributes: {name, smartsTemplate},
        children: sources.map(source => ({name: source, children: []})),
      })
    }

    tree.children.push({name, attributes, children})
  }

  return tree
}
const tree = makeTree(json)
// console.log(tree)

// use jss styling
const useRoutesStyles = createUseStyles({
  foundation: {
    height: '100%',
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
  classes,
}) => {
  return (
    <foreignObject {...foreignObjectProps}>
      <button
        onClick={toggleNode}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: 'white',
          width: 200,
          height: 340,
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: 10,
        }}
      >
        <header>HEADER</header>
        <section
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
            overflow: 'auto',
            margin: '2px 0',
            backgroundColor: 'pink',
            width: '100%',
          }}
        >
          SVG
        </section>
        <footer
          style={{
            flex: 1,
            margin: '2px 0',
            overflow: 'auto',
            width: '100%',
            backgroundColor: 'orange',
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

  const fetchRoutes = async () => {
    const response = await fetch('http://localhost:8000/routes')
    // If using VSCode + windows, try using your IP
    // instead (see frontent terminal)
    //const response = await fetch("http://X.X.X.X:8000/routes");
    const newRoutes = await response.json()
    // console.log(newRoutes)
    setRoutes(newRoutes.data)
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  // TODO: use react-d3-tree to visualize the routes
  //   - https://www.npmjs.com/package/react-d3-tree

  return (
    <div className={styles.foundation}>
      {tree.children.map((route, i) => (
        <div key={i} style={containerStyles} ref={containerRef}>
          <Tree
            data={route.children}
            translate={translate}
            dimensions={dimensions}
            nodeSize={nodeSize}
            separation={separation}
            transitionDuration="1000"
            pathFunc="step"
            renderCustomNodeElement={rd3tProps =>
              renderForeignObjectNode({...rd3tProps, foreignObjectProps})
            }
            orientation="vertical"
          />
        </div>
      ))}
    </div>
  )
}
