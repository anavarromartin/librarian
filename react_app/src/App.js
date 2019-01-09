import React, { Component } from 'react'
import HomePage from './HomePage/HomePage'
import { BrowserRouter, Route } from "react-router-dom"
import ManageContainer from './Manage/ManageContainer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/manage" component={ManageContainer} />

                    <ToastContainer autoClose={3000}/>
                </div>
            </BrowserRouter>
        )
    }
}

export default App
