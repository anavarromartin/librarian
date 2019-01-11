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
    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Offices</span>
                </div>
                <div style={styles}>
                    <Link to="/dallas" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary">Dallas</Button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Offices