import React, { useState } from "react";
import { Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { gsap } from "gsap";
import "./App.scss";
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"

import About from "./pages/about";
import Header from "./components/header";
import Home from "./pages/home";
import Login from "./pages/login"

const routes = [
  { path: "/", name: "Home", Component: Home },
  { path: "/about", name: "About", Component: About },
  { path: "/login", name: "Login", Component: Login }
];

function App() {
  const history = useHistory()
  const location1 =useLocation()
  console.log(location1,history)
  const match = useRouteMatch('/login')
  console.log(match)
  const onEnter = node => {
    gsap.from(
      [node.children[0].firstElementChild, node.children[0].lastElementChild],
      0.6,
      {
        y: 30,
        delay: 0.6,
        ease: "power3.InOut",
        opacity: 0,
        stagger: {
          amount: 0.6
        }
      }
    );
  };

  const onExit = node => {
    gsap.to(
      [node.children[0].firstElementChild, node.children[0].lastElementChild],
      0.6,
      {
        y: -30,
        ease: "power3.InOut",
        stagger: {
          amount: 0.2
        }
      }
    );
  };

  return (
    <>
     {!match && <Header />}
              <div className='container'>
       <Switch>

        {routes.map(({ path, Component }) => (
          <Route key={path} exact path={path}>
            {({ match }) => (
              <CSSTransition
                in={match != null}
                timeout={1200}
                classNames='page'
                onExit={onExit} 
                onEntering={onEnter}
                unmountOnExit>
                <div className='page'>
                  <Component />
                </div>
              </CSSTransition>
            )}
          </Route>
        ))}
       </Switch>
      </div>
    </>
  );
}

export default App;
