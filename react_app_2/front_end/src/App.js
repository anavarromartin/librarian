import React, {useState} from 'react';
import './App.scss';
import classNames from 'classnames'
import Library from "./components/library/library";
import AppHeader from "./components/app-header/app-header"
import {BrowserRouter, Route, Switch} from "react-router-dom";
import ReturnBook from "./components/return-book/return-book"
import {routePrefix} from "./globals"
import {borrowBook, getAvailableBooks, getCheckedOutBooks, getOfficeBooks, returnBook} from "./methods/book-methods";
import BorrowBook from "./components/borrow-book/borrow-book"
import LibraryBrowsing from "./components/library-browsing/library-browsing";

const renderComponent = (component, routeProps, renderProps) => {
    const allProps = {...routeProps, ...renderProps}
    return React.createElement(component, {...allProps}, null)
}

const RouteWithBackNav = props => {

    return (
        <Route
            path={props.path}
            exact
            render={routeProps => renderComponent(props.component, props, routeProps)}
        />
    )
}

const App = () => {
    const [backLocation, setBackLocation] = useState(null)
    const [headerVisible, setHeaderVisibility] = useState(true)
    const [headerConfig, setHeaderConfig] = useState({})

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
        getCheckedOutBooks: getCheckedOutBooks,
        getAvailableBooks: getAvailableBooks,
        returnBook: returnBook,
        borrowBook: borrowBook,
        getOfficeBooks: getOfficeBooks,
        setHeaderConfig: setHeaderConfig
    }


    const backButtonEnabled = () => backLocation !== null

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className={"top-container"}>
                <div className={classNames({"header--hidden": !headerVisible})}>
                    <Route
                        path={"*"}
                        render={props => <AppHeader {...props}
                                                   onNavigateBack={navigateBack}
                                                    headerConfig={headerConfig}
                                                   backButtonEnabled={backButtonEnabled}
                        />}
                    />
                </div>
                <div className={"content"}>
                    <Switch>
                        <RouteWithBackNav path={`/return`} component={ReturnBook} {...componentProps}/>
                        <RouteWithBackNav path={`/borrow`} component={BorrowBook} {...componentProps}/>
                        <RouteWithBackNav path={`/browse`} component={LibraryBrowsing} {...componentProps}/>
                        <RouteWithBackNav path={`/`} component={Library} {...componentProps}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    )
}


export default App;
