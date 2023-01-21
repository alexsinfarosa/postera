import React from 'react'
import Tree from 'react-d3-tree'
import {useCenteredTree} from '../hooks/useCenteredTree'
import {createUseStyles} from 'react-jss'

const NODE = {
  width: 200,
  height: 300,
}

const useRoutesStyles = createUseStyles({
  container: {
    height: '100%',
  },
  resetBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
  },
  node: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0e7490',
    width: NODE.width,
    height: NODE.height,
    border: '1px solid #0284c7',
    borderRadius: 8,
    padding: '8px',
    color: '#f0f9ff',
    fontSize: 16,
    boxShadow: '0 8px 24px 0 #959DA5',
    flex: 1,
    position: 'relative',
    cursor: 'pointer',
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
    marginBottom: 8,
  },
  nodeFooter: {},
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  reactionName: {
    width: '100%',
    height: 48,
    position: 'absolute',
    padding: '2px 10px',
    backgroundColor: '#fef3c7',
    color: '#854d0e',
    bottom: 0,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordBreak: 'break-all',
  },
  molecules: {
    borderRadius: 8,
    marginTop: 8,
    height: '100%',
    color: 'gray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    opacity: 0.6,
    transition: '0.5s',
    '&:hover': {
      opacity: 1,
    },
  },
})

const customNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  svgs,
  styles,
  style,
  setStyle,
}) => {
  // console.log(nodeDatum)
  const multiplier = 60
  const isReaction = nodeDatum.attributes?.name
  const isCollapsed = nodeDatum.__rd3t.collapsed
  return (
    <>
      <foreignObject {...foreignObjectProps}>
        <button
          id={nodeDatum.attributes?.id}
          type="button"
          name={nodeDatum.name}
          onClick={toggleNode}
          className={styles.resetBtn}
          onMouseEnter={e => {
            if (e.currentTarget.name === nodeDatum.name) {
              setStyle({display: 'block'})
            }
          }}
          onMouseLeave={e => {
            if (e.currentTarget.name === nodeDatum.name) {
              setStyle({display: 'none'})
            }
          }}
        >
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
              <p className={styles.molecules} style={style}>
                Ciccio!!!
              </p>
            </div>
          </div>
        </button>
      </foreignObject>
      {isReaction && !isCollapsed && (
        <foreignObject
          width={NODE.width + multiplier}
          height={multiplier}
          x={-NODE.width / 2 - multiplier / 2}
          y={NODE.height - 110}
        >
          <div className={styles.reactionName}>
            {nodeDatum.attributes?.name}
          </div>
        </foreignObject>
      )}
    </>
  )
}

export const RouteTree = ({route, svgs}) => {
  const [style, setStyle] = React.useState({display: 'none'})
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
            style,
            setStyle,
          })
        }
        orientation="vertical"
      />
    </div>
  )
}
