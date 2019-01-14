import React, { Component } from 'react'
import Inventory from '../Inventory/Inventory'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import SearchBar from 'material-ui-search-bar'

class SearchContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            books: []
        }

        this.fetchBooks = this.fetchBooks.bind(this)
        this.search = this.search.bind(this)
    }

    componentDidMount() {
        this.fetchBooks()
    }

    async fetchBooks() {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/${this.props.location.state.officeId}/books`

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
                books: res.data.books
            })
        ).catch(error => {
            throw error
        })
    }

    async search(searchCriteria) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/${this.props.location.state.officeId}/books?search=${searchCriteria}`

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
                books: res.data.books
            })
        ).catch(error => {
            throw error
        })
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '4em' }}>{this.props.match.params.officeName.charAt(0).toUpperCase() + this.props.match.params.officeName.slice(1)}</span>
                </div>
                <Link to={{ pathname: `/${this.props.match.params.officeName}`, state: { officeId: this.props.location.state.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                    <Button variant="contained" color="primary">Back</Button>
                </Link>
                <SearchBar
                    onCancelSearch={this.fetchBooks}
                    onRequestSearch={(searchCriteria) => this.search(searchCriteria)}
                    style={{
                        margin: '0 auto',
                        maxWidth: 800
                    }}
                />
                <Inventory books={this.state.books} handleDelete={() => { }} canDelete={false} />
            </div>
        )
    }
}

export default SearchContainer