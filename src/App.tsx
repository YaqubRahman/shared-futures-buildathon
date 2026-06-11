import { lazy, Suspense } from "react";

const Map = lazy(() => import("./components/Map"));

function App() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <Map />
    </Suspense>
  );
}

export default App;
