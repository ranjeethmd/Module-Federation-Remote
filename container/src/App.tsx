import React from "react";
import "./App.css";

const CounterApp1 = React.lazy(() => import("app1/CounterApp1"));
const CounterApp2 = React.lazy(() => import("app2/CounterApp2"));

function App() {
  return (
    <div className="App">
      <div>
        <h1>App 1</h1>
        <React.Suspense fallback="Loading ....">
          <CounterApp1 />
        </React.Suspense>
      </div>
      <div>
        <h1>App 2</h1>
        <React.Suspense fallback="Loading ....">
          <CounterApp2 />
        </React.Suspense>
      </div>
    </div>
  );
}

export default App;
