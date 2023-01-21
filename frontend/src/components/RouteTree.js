import Tree from 'react-d3-tree'
import {useCenteredTree} from '../hooks/useCenteredTree'
import {createUseStyles} from 'react-jss'

const NODE = {
  width: 200,
  height: 300,
  padding: 10,
}

const useRoutesStyles = createUseStyles({
  container: {
    height: '100%',
  },
  node: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0e7490',
    width: NODE.width,
    height: NODE.height,
    border: '1px solid #0284c7',
    borderRadius: 8,
    padding: Node.padding,
    color: '#f0f9ff',
    fontSize: 16,
    boxShadow: '0 8px 24px 0 #959DA5',
    flex: 1,
    position: 'relative',
  },
  svg: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'auto',
    backgroundColor: 'white',
    height: NODE.height / 2,
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
    bottom: 8,
    left: '25%',
  },
  reactionName: {
    width: '100%',
    height: 48,
    position: 'absolute',
    padding: '2px 10px',
    backgroundColor: '#fef3c7',
    color: '#854d0e',
    fontSize: 14,
    bottom: 0,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordBreak: 'break-all',
    // boxShadow: '0 8px 24px 0 #959DA5',
  },
})

const customNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  svgs,
  styles,
  reactionName,
}) => {
  // console.log(nodeDatum)
  const multiplier = 60
  return (
    <>
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
      {nodeDatum.children.length > 0 && (
        <foreignObject
          width={NODE.width + multiplier}
          height={NODE.height}
          x={-NODE.width / 2 - multiplier / 2}
          y={-NODE.height / 2 + 100}
        >
          {/* <div className={styles.reactionName}>{reactionName}</div> */}
          <div className={styles.reactionName}>
            Buchwald-Hartwig amidation with amide-like nucleophile
          </div>
        </foreignObject>
      )}
    </>
  )
}

export const RouteTree = ({route, svgs}) => {
  const styles = useRoutesStyles()

  const nodeSize = {
    x: NODE.width + NODE.width / 2,
    y: NODE.height + NODE.height / 2,
  }
  const separation = {siblings: 1, nonSiblings: 2}
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -NODE.width / 2,
    y: -NODE.height / 2,
  }
  console.log(foreignObjectProps)

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
            reactionName: route.attributes?.name,
          })
        }
        orientation="vertical"
      />
    </div>
  )
}
