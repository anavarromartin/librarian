import React, { Component } from 'react'
import OfficesPage from './offices/OfficesPage'
import OfficePage from './offices/OfficePage'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddBookPage from './books/AddBookPage'
import LoginPage from './login/LoginPage'
import CheckinPage from './books/CheckinPage'
import ReportPage from './report/ReportPage'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/login" exact component={LoginPage} />
                        <Route path="/:officeName" exact component={OfficePage} />
                    </Switch>
                    <Route path="/" exact component={OfficesPage} />
                    <Route path="/:officeName/add-book" render={(props) => !!window.localStorage.access_token ? <AddBookPage {...props} /> : <Redirect to='/' />} />
                    <Route path="/:officeName/checkin" component={CheckinPage} />
                    <Route path="/:officeName/report" component={ReportPage} />

                    <ToastContainer autoClose={3000} />
                </div>
            </BrowserRouter>
        )
    }
}

export default App
