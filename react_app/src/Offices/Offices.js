import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    flexDirection: 'column'
}

class Offices extends Component {
    constructor(props) {
        super(props)

        this.state = {
            offices: []
        }

        this.fetchOffices = this.fetchOffices.bind(this)
    }

    componentDidMount() {
        this.fetchOffices()
    }

    async fetchOffices() {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices`

        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(response => {
            if (response.ok) {
                return response
            } else {
                throw Error(`Request rejected with status ${response.status}`)
            }
        }).then(response =>
            response.json().then(content => ({
                data: content.data,
                status: response.status
            }))
        ).then(res =>
            this.setState({
                offices: res.data.offices
            })
        ).catch(error => {
            throw error
        })
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Offices</span>
                </div>
                <div style={styles}>
                    {this.state.offices.map(function (office) {
                        return (
                            <Link key={office.id} to={{pathname: `/${office.name}`, state: {officeId: office.id}}} style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary">{office.name}</Button>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Offices