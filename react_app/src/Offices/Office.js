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

const Office = (props) =>
    <div>
        <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '4em' }}>{props.match.params.officeName.charAt(0).toUpperCase() + props.match.params.officeName.slice(1)}</span>
            </div>
            <Link to="/" style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px', width: '80px' }}>
                <Button variant="contained" color="primary">Back</Button>
            </Link>
        </div>
        <div style={styles}>
            <Link to={{ pathname: `/${props.match.params.officeName}/search`, state: { officeId: props.location.state.officeId } }} style={{ textDecoration: 'none', margin: '10px' }}>
                <Button style={{ height: '200px', width: '400px', fontSize: '4em' }} variant="contained" color="primary">Search</Button>
            </Link>
            <Link to={{ pathname: `/${props.match.params.officeName}/manage`, state: { officeId: props.location.state.officeId } }} style={{ textDecoration: 'none', margin: '10px' }}>
                <Button style={{ height: '200px', width: '400px', fontSize: '4em' }} variant="contained" color="primary">Manage</Button>
            </Link>
        </div>
    </div>

export default Office