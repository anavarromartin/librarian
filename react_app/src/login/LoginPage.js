import React, { Component } from 'react'
import { withRouter } from 'react-router'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

class LoginPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            error: '',
        }

        this.login = this.login.bind(this)
    }

    async login(e) {
        e.preventDefault()

        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/login`

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        })

        if (response.ok) {
            const res = await response.json()

            this.setState({
                error: '',
            })

            window.localStorage.access_token = res.access_token

            this.props.history.goBack()
        } else if (response.status === 401) {
            const res = await response.json()

            this.setState({
                error: res.error
            })
        } else {
            throw Error(`Request rejected with status ${response.status}`)
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Paper style={{ padding: '30px', height: '275px' }}>
                    <form method='POST'>
                        <div style={{ fontWeight: 'bold', fontSize: '2em', marginBottom: '10px' }}>Admin Login</div>
                        <div>
                            <TextField
                                label="Username"
                                value={this.state.username}
                                onChange={this.handleChange('username')}
                                margin="normal"
                                type='text'
                                autoFocus={true}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                margin="normal"
                                type='password'
                            />
                        </div>
                        {this.state.error && <div style={{ color: 'red' }}>{this.state.error}</div>}
                        <Button
                            style={{ margin: '20px 0' }}
                            type='submit'
                            variant="contained"
                            color="secondary"
                            onClick={this.login}
                            disabled={!(!!this.state.username && !!this.state.password)}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </div>
        )
    }
}

export default withRouter(LoginPage)