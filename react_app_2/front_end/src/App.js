import React, {useState} from 'react';
import './App.scss';
import classNames from 'classnames'
import Library from "./components/library/library";
import AppHeader from "./components/app-header/app-header"
import {BrowserRouter as Router, Route} from "react-router-dom";
import ReturnBook from "./components/return-book/return-book"
import {routePrefix} from "./globals"
import {getBooks} from "./methods/book-methods";

const renderComponent = (component, routeProps, renderProps) => {
    const allProps = {...routeProps, ...renderProps}
    return React.createElement(component, {...allProps}, null)
}

const RouteWithBackNav = props => {

    return (
        <Route
            exact
            path={props.path}
            render={routeProps => renderComponent(props.component, props, routeProps)}
        />
    )
}

const App = () => {
    const [backLocation, setBackLocation] = useState(null)
    const [headerVisible, setHeaderVisibility] = useState(true)

    const navigateBack = (history) => {
        console.log('back location:' + backLocation)
        history.push(backLocation)
    }

    const customSetBackLocation = (loc) => {
        console.log(`setting location: ${loc}`)
        setBackLocation(loc)
    }

    const componentProps = {
        setBackLocation: customSetBackLocation,
        setHeaderVisibility: setHeaderVisibility,
        getBooks: getBooks
    }

    const backButtonEnabled = () => backLocation !== null

    return (
        <Router>
            <div className={"top-container"}>
                <div className={classNames({"header--hidden": !headerVisible})}>
                    <Route
                        path={"*"}
                        render={props => <AppHeader {...props}
                                                   onNavigateBack={navigateBack}

                                                   backButtonEnabled={backButtonEnabled}
                        />}
                    />
                </div>
                <div className={"content"}>
                    <RouteWithBackNav path={`${routePrefix}/return`} component={ReturnBook} {...componentProps}/>
                    <RouteWithBackNav path={`${routePrefix}`} component={Library} {...componentProps}/>
                </div>
            </div>
        </Router>
    )
}


export default App;
