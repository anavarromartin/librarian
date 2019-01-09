import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column'
}

const HomePage = () =>
    <div style={styles}>
        <Link to="/manage" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">Manage</Button>
        </Link>
    </div>

export default HomePage