import React, { Component } from 'react'
import Offices from './offices/Offices'
import Office from './offices/Office'
import { BrowserRouter, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddBook from './books/AddBook'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={Offices} />
                    <Route path="/:officeName" exact component={Office} />
                    <Route path="/:officeName/add-book" component={AddBook} />

                    <ToastContainer autoClose={3000} />
                </div>
            </BrowserRouter>
        )
    }
}

export default App
