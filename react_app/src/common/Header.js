import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

class Header extends Component {
    constructor(props) {
        super(props)

        this.logout = this.logout.bind(this)
    }

    async logout(e) {
        e.preventDefault()

        window.localStorage.removeItem('access_token')
        window.location.reload()
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '4em' }}>{this.props.officeName.charAt(0).toUpperCase() + this.props.officeName.slice(1)}</span>
                {!!!window.localStorage.access_token && <Link to='/login' style={{ position: "absolute", right: '10px', top: '10px', textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">Admin Login</Button>
                </Link>}
                {!!window.localStorage.access_token && <Button className="logout" variant="contained" color="primary" onClick={this.logout} style={{ position: "absolute", right: '10px', top: '10px' }}>
                    Logout
                </Button>}
            </div>
        )
    }
}

Header.propTypes = {
    officeName: PropTypes.string.isRequired,
}

export default withRouter(Header)