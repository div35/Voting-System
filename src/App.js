import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./Components/Login";
import NavHeading from "./Components/NavHeading";
import Elections from "./Components/Elections";
import Election from "./Components/Election";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavHeading />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/election/:id" component={Election}/>
          <Route path="/" component={Elections} exact/>
          <Redirect to="/" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
