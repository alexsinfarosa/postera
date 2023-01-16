import React, {useEffect, useState} from "react";
import {createUseStyles} from 'react-jss';

// use jss styling
const useRoutesStyles = createUseStyles({
  foundation: {
    margin: '10px',
  },
});

export const Routes = () => {
  const styles = useRoutesStyles();
  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    const response = await fetch("http://localhost:8000/routes");
    // If using VSCode + windows, try using your IP 
    // instead (see frontent terminal)
    //const response = await fetch("http://X.X.X.X:8000/routes");
    const newRoutes = await response.json();
    setRoutes(newRoutes.data);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // TODO: use react-d3-tree to visualize the routes
  //   - https://www.npmjs.com/package/react-d3-tree

  return (
    <div className={styles.foundation}>
      {routes.map((route, routeNumber) => (
        <h1 key={routeNumber}>Route {routeNumber}</h1>
      ))}
    </div>
  );
};
