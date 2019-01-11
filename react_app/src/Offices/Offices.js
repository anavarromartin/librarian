import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column'
}

class Offices extends Component {
    render() {
        return (
            <div style={styles}>
                <Link to="/dallas" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">Dallas</Button>
                </Link>
            </div>
        )
    }
}

export default Offices