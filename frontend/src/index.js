import React from "react";
import { render } from 'react-dom';

import {Header, Routes} from "./components";

function App() {
  return (
    <main>
      <Header />
      <Routes />
    </main>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
