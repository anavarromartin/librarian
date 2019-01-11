import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    flexDirection: 'column',
}

const Office = ({ match }) =>
    <div>
        <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{match.params.officeName.charAt(0).toUpperCase() + match.params.officeName.slice(1)}</span>
            </div>
            <Link to="/" style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px', width: '80px' }}>
                <Button variant="contained" color="primary">Back</Button>
            </Link>
        </div>
        <div style={styles}>
            <Link to={`/${match.params.officeName}/manage`} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">Manage</Button>
            </Link>
        </div>
    </div>

export default Office