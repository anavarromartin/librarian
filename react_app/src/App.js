import React, { Component } from 'react'
import Offices from './Offices/Offices'
import Office from './Offices/Office'
import { BrowserRouter, Route } from "react-router-dom"
import ManageContainer from './Manage/ManageContainer'
import SearchContainer from './Search/SearchContainer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={Offices} />
                    <Route path="/:officeName" exact component={Office} />
                    <Route path="/:officeName/manage" component={ManageContainer} />
                    <Route path="/:officeName/search" component={SearchContainer} />

                    <ToastContainer autoClose={3000} />
                </div>
            </BrowserRouter>
        )
    }
}

export default App
