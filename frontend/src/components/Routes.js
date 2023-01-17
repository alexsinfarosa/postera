import React, {useEffect, useState} from 'react'
import {createUseStyles} from 'react-jss'
import Tree from 'react-d3-tree'
import json from '../routes.json'

// create a tree from the json
function makeTree(json) {
  const tree = {name: 'root', children: []}

  for (let i = 0; i < json.length; i++) {
    const route = json[i]
    route.route = i + 1
    route.children = []

    const {reactions} = route
    for (let j = 0; j < reactions.length; j++) {
      const reaction = reactions[j]
      const {name, target, sources} = reaction

      route.children.push({
        name: target,
        attributes: {name},
        children: sources.map(source => ({name: source})),
      })
    }

    tree.children.push({
      name: `Route ${i + 1}`,
      children: route.children,
    })
  }

  return tree
}
const tree = makeTree(json)
console.log(tree)

// use jss styling
const useRoutesStyles = createUseStyles({
  foundation: {
    margin: '10px',
    backgroundColor: '#f8fafc',
    height: '100vh',
    width: '100%',
    overflow: 'auto',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    color: '#333',
  },
  node__root: {
    '& circle': {
      fill: 'red',
      r: 20,
      stroke: 'red',
      strokeWidth: 1,
    },
  },
  node__branch: {
    '& circle': {
      fill: 'green',
      r: 20,
      stroke: 'green',
      strokeWidth: 1,
    },
  },
  node__leaf: {
    '& circle': {
      fill: 'orange',
      r: 20,
      stroke: 'orange',
      strokeWidth: 1,
    },
  },
})

export const Routes = () => {
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
      {tree.children.map(route => (
        <Tree
          key={route.name}
          data={route.children}
          orientation="vertical"
          rootNodeClassName={styles.node__root}
          branchNodeClassName={styles.node__branch}
          leafNodeClassName={styles.node__leaf}
          translate={{x: 600, y: 200}}
        />
      ))}

      {/* <pre>{JSON.stringify(tree, null, 2)}</pre> */}
    </div>
  )
}
