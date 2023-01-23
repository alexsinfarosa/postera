import {createUseStyles} from 'react-jss'

const useRoutesStyles = createUseStyles({
  li: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '2px solid #9ca3af',
    marginBottom: 32,
    borderRadius: 8,
  },
})

export const MoleculeList = ({svgs, route, moleculesRoutes}) => {
  const styles = useRoutesStyles()

  return (
    <ul>
      {Object.keys(svgs)
        .filter(smiles => smiles !== route.name)
        .map((smiles, i) => {
          return (
            <li key={i} className={styles.li}>
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

                <div>
                  <span style={{overflowWrap: 'break-word'}}>
                    In Route: {moleculesRoutes[smiles].join(',')}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
    </ul>
  )
}
