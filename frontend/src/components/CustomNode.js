import {createUseStyles} from 'react-jss'

const useRoutesStyles = createUseStyles({})

export const CustomNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  svgs,
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
