import React, {useState} from 'react';
import './App.css';
import Library from "./components/library/library";
import AppHeader from "./components/app-header/app-header"
import {BrowserRouter as Router, Route} from "react-router-dom";
import ReturnBook from "./components/return-book/return-book"
import {routePrefix} from "./globals"

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

    const navigateBack = (history) => {
        console.log('back location:' + backLocation)
        history.push(backLocation)
    }

    const customSetBackLocation = (loc) => {
        console.log(`setting location: ${loc}`)
        setBackLocation(loc)
    }

    const locationProps = {
        setBackLocation: customSetBackLocation,
    }

    const backButtonEnabled = () => backLocation !== null

    return (
        <Router>
            <div className={"main-content"}>
                <Route
                    path={"*"}
                    render={props => <AppHeader {...props}
                                                onNavigateBack={navigateBack}
                                                backButtonEnabled={backButtonEnabled}
                    />}
                />
                <RouteWithBackNav path={`${routePrefix}/return`} component={ReturnBook} {...locationProps}/>
                <RouteWithBackNav path={`${routePrefix}`} component={Library} {...locationProps}/>
            </div>
        </Router>
    )
}


export default App;
