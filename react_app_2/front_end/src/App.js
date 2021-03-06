import React, {useEffect, useState} from 'react';
import './App.scss';
import classNames from 'classnames'
import AppHeader from "./components/app-header/app-header"
import {BrowserRouter, Route, Switch} from "react-router-dom";
import ReturnBook from "./components/return-book/return-book"
import {
    borrowBook,
    getAvailableBooks, getBookDescriptionByIsbn,
    getBooksByIsbn,
    getCheckedOutBooks,
    getOfficeBooks,
    returnBook
} from "./methods/book-methods";
import BorrowBook from "./components/borrow-book/borrow-book"
import LibraryBrowsing from "./components/library-browsing/library-browsing";
import BookDetail from "./components/book-detail/book-detail";

const renderComponent = (component, routeProps, renderProps) => {
    const allProps = {...routeProps, ...renderProps}
    return React.createElement(component, {...allProps}, null)
}

const RouteWithProps = props => {
    return (
        <Route
            path={props.path}
            exact
            render={routeProps => renderComponent(OfficeIdComponentWrapper, props, routeProps)}
        />
    )
}

const getOffice = (offices, officeName) => {
    return offices.filter(office => office.name.toLowerCase() === officeName.toLowerCase())[0]
}

const OfficeIdComponentWrapper = props => (
    React.createElement(
        props.component,
        {office: getOffice(props.offices, props.match.params.officeName), ...props},
        null
    )
)

const App = offices => {
    const [backLocation, setBackLocation] = useState(null)
    const [headerVisible, setHeaderVisibility] = useState(true)
    const [headerConfig, setHeaderConfig] = useState({})
    const [toastMessage, setToastMessage] = useState(null)

    const navigateBack = (history) => {
        console.log('back location:' + backLocation)
        history.push(backLocation)
    }

    const displayToastMessage = message => {
        setToastMessage(message)
        setTimeout(() => {
            setToastMessage(null)
        }, 3500)
    }

    const componentProps = {
        setBackLocation: setBackLocation,
        setHeaderVisibility: setHeaderVisibility,
        getCheckedOutBooks: getCheckedOutBooks,
        getAvailableBooks: getAvailableBooks,
        returnBook: returnBook,
        borrowBook: borrowBook,
        getOfficeBooks: getOfficeBooks,
        getBooksByIsbn: getBooksByIsbn,
        getBookDescriptionByIsbn: getBookDescriptionByIsbn,
        setHeaderConfig: setHeaderConfig,
        offices: offices.offices,
        displayToastMessage: displayToastMessage,
    }

    const backButtonEnabled = () => backLocation !== null

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className={"top-container"}>
                <div className={classNames({"header--hidden": !headerVisible})}>
                    <Route
                        path={"/:officeName"}
                        render={props => <AppHeader {...props}
                                                    onNavigateBack={navigateBack}
                                                    headerConfig={headerConfig}
                                                    backButtonEnabled={backButtonEnabled}
                        />}
                    />
                </div>
                <div className={"content"}>
                    <Switch>
                        <RouteWithProps path={`/:officeName/return`} component={ReturnBook} {...componentProps}/>
                        <RouteWithProps path={`/:officeName/borrow`} component={BorrowBook} {...componentProps}/>
                        <RouteWithProps path={`/:officeName/books/:isbn`} component={BookDetail} {...componentProps}/>
                        <RouteWithProps path={`/:officeName`} component={LibraryBrowsing} {...componentProps}/>
                    </Switch>
                </div>
                <ToastMessage message={toastMessage}/>
            </div>
        </BrowserRouter>
    )
}

const ToastMessage = ({message}) => {
    const [displayMessage, setDisplayMessage] = useState(message)
    const [displaying, setDisplaying] = useState(false)
    useEffect(() => {
        if (message === null) {
            setTimeout(() => {
                setDisplayMessage(null)
                setDisplaying(false)
            }, 2000)
        } else {
            setDisplaying(true)
            setDisplayMessage(message)
        }
    }, [message])
    return (
        <div className={classNames("toast_container", {
            "toast_container--show": message !== null && displaying,
            "toast_container--hide": message === null && displaying,
        })}>
            {displayMessage}
        </div>
    )
}

export default App;
