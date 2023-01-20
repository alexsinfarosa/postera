import Tree from 'react-d3-tree'
import {useCenteredTree} from '../utils'
import {createUseStyles} from 'react-jss'

const useRoutesStyles = createUseStyles({
  container: {
    height: '100%',
  },
  node: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0e7490',
    width: 200,
    height: 300,
    border: '1px solid #0284c7',
    borderRadius: 8,
    padding: 10,
    color: '#f0f9ff',
    fontSize: 16,
    // cursor: 'inherit',
    boxShadow: '0 8px 24px 0 #959DA5',
    flex: 1,
  },
  svg: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'auto',
    backgroundColor: 'white',
    height: 150,
    borderRadius: 8,
  },
  nodeFooter: {flex: 1, position: 'relative', height: '100%'},
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#0e7490',
    border: '1px solid #FFF',
    color: 'white',
    padding: '8px 16px',
    textAlign: 'center',
    fontSize: 16,
    cursor: 'pointer',
    borderRadius: 8,
    width: '50%',
    // margin: '0 auto',
    position: 'absolute',
    bottom: 0,
    left: '25%',
  },
})

const customNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  svgs,
  styles,
}) => {
  return (
    <foreignObject {...foreignObjectProps}>
      <div className={styles.node}>
        <div className={styles.svg}>
          {svgs && (
            <span
              dangerouslySetInnerHTML={{
                __html: svgs[nodeDatum.name],
              }}
            />
          )}
        </div>

        <div className={styles.nodeFooter}>
          <p className={styles.truncate}>{nodeDatum.name}</p>
          {nodeDatum.children.length !== 0 && (
            <button onClick={toggleNode} className={styles.btn}>
              {nodeDatum.__rd3t.collapsed ? 'Expand' : 'Collapse'}
            </button>
          )}
        </div>
      </div>
    </foreignObject>
  )
}

// const straightPathFunc = (linkDatum, orientation) => {
//   const {source, target} = linkDatum
//   return `M${source.x},${source.y}L${target.x},${target.y}`
// }

export const RouteTree = ({route, svgs}) => {
  const styles = useRoutesStyles()

  const nodeSize = {x: 350, y: 430}
  const separation = {siblings: 1, nonSiblings: 2}
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -110,
    y: -160,
  }

  const [dimensions, translate, containerRef] = useCenteredTree()
  return (
    <div className={styles.container} ref={containerRef}>
      <Tree
        data={route}
        translate={translate}
        dimensions={dimensions}
        nodeSize={nodeSize}
        separation={separation}
        transitionDuration="1000"
        pathFunc="step"
        renderCustomNodeElement={rd3tProps =>
          customNode({
            ...rd3tProps,
            foreignObjectProps,
            svgs,
            styles,
          })
        }
        orientation="vertical"
        // pathFunc={straightPathFunc}
      />
    </div>
  )
}
