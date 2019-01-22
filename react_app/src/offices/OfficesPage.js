import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '900px',
    margin: 'auto',
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

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })

        if (!response.ok) {
            throw Error(`Request rejected with status ${response.status}`)
        }

        const content = await response.json()

        this.setState({
            offices: content.data.offices
        })
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '4em' }}>Offices</span>
                </div>
                <div style={styles}>
                    {this.state.offices.map(function (office) {
                        return (
                            <Link key={office.id} to={{ pathname: `/${office.name}`, state: { officeId: office.id } }} style={{ textDecoration: 'none', margin: '10px' }}>
                                <Button style={{ height: '100px', width: '200px', fontSize: '2em' }} variant="contained" color="primary">{office.name}</Button>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Offices