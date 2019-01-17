import React, { Component } from 'react'
import OfficesPage from './offices/OfficesPage'
import OfficePage from './offices/OfficePage'
import { BrowserRouter, Route, Redirect } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddBookPage from './books/AddBookPage'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={OfficesPage} />
                    <Route path="/:officeName" exact strict component={OfficePage} />
                    <Route path="/:officeName/add-book" render={(props) => (
                        !!window.session ?
                            <AddBookPage {...props} />
                            :
                            null
                    )} />

                    <ToastContainer autoClose={3000} />
                </div>
            </BrowserRouter>
        )
    }
}

export default App
