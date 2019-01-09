import React, { Component } from 'react'
import HomePage from './HomePage'
import { BrowserRouter, Route } from "react-router-dom"
import Manage from './Manage'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/manage/" component={Manage} />
                </div>
            </BrowserRouter>
        )
    }
}

export default App
