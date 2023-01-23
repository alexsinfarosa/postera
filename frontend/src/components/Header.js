import {createUseStyles} from 'react-jss'

const useRoutesStyles = createUseStyles({
  routeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    background: 'white',
    color: '#334155',
    borderRadius: 8,
    padding: '2px 10px',
    fontSize: 16,
    '&:hover': {
      backgroundColor: '#f8fafc',
    },
    '&:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    color: '#475569',
    fontWeight: 700,
  },
  spanText: {
    marginLeft: 16,
    marginRight: 16,
  },
})

export const Header = ({routes, route, routeId, setRouteId}) => {
  const styles = useRoutesStyles()

  function handleRouteIncrement() {
    if (routeId < routes.length) {
      setRouteId(routeId + 1)
    }
  }

  function handleRouteDecrement() {
    if (routeId > 1) {
      setRouteId(routeId - 1)
    }
  }

  return (
    <header style={{padding: 16}}>
      <h1 className={styles.header}>{route.name}</h1>
      <div>
        <div style={{fontSize: 24}}>
          <button
            type="button"
            aria-label="previous route"
            className={styles.routeBtn}
            onClick={handleRouteDecrement}
            disabled={routeId === 1}
          >
            &#8592; prev
          </button>
          <span className={styles.spanText}>
            Route {route.attributes.id} / {routes.length}
          </span>
          <button
            type="button"
            aria-label="next route"
            className={styles.routeBtn}
            onClick={handleRouteIncrement}
            disabled={routeId === routes.length}
          >
            next &#8594;
          </button>
        </div>
      </div>
    </header>
  )
}
