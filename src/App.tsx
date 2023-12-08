import AppRoutes from "./Routes";
import { Body, Footer, Toolbar } from "./components/layout";

function App() {
  return (
    <>
      <Toolbar />
      <Body>
        <AppRoutes />
      </Body>
      <Footer />
    </>
  );
}

export default App;
