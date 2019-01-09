import React from 'react'
import { Link } from 'react-router-dom'

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column'
}

const HomePage = () =>
    <div style={styles}>
        <Link to="/manage">
            <button type="button">Manage</button>
        </Link>
    </div>

export default HomePage