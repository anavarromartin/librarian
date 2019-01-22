import React, { Component } from 'react'
import Inventory from '../books/Inventory'
import SearchBar from 'material-ui-search-bar'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Header from '../common/Header'
import PropTypes from 'prop-types'

class Office extends Component {
    constructor(props) {
        super(props)

        this.state = {
            books: [],
            searchCriteria: '',
        }

        this.fetchBooks = this.fetchBooks.bind(this)
        this.search = this.search.bind(this)
        this._getBooks = this._getBooks.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.checkoutBook = this.checkoutBook.bind(this)
    }

    componentDidMount() {
        this.fetchBooks()
    }

    async fetchBooks() {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/${this.props.location.state.officeId}/books`

        await this._getBooks(url)
    }

    async search(searchCriteria) {
        this.setState({
            searchCriteria: searchCriteria
        })

        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/${this.props.location.state.officeId}/books?search=${searchCriteria}`

        await this._getBooks(url);
    }

    async _getBooks(url) {
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
            books: content.data.books
        })
    }

    async handleDelete(book) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${book.id}`

        const response = await fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.localStorage.access_token}`,
            }
        })

        if (!response.ok) {
            if(response.status === 401) {
                this.props.history.push('/login')
                return
            }

            throw Error(`Request rejected with status ${response.status}`)
        }

        toast(`${book.name} successfully deleted!`)
        this.fetchBooks()
    }

    async checkoutBook(book, borrowerName, borrowerEmail) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${book.id}?checkout=true`

        const response = await fetch(url, {
            method: 'PATCH',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name: borrowerName,
                email: borrowerEmail,
            }),
        })

        if (!response.ok) {
            throw Error(`Request rejected with status ${response.status}`)
        }

        toast(`Thank you! You've checked out ${book.name} by ${book.authors}.`)

        this.setState({
            searchCriteria: '',
        })

        this.fetchBooks()
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <Header {...this.props} />
                <div>
                    <Link to={{ pathname: `/` }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Back</Button>
                    </Link>
                    <Link to={{ pathname: `/${this.props.match.params.officeName}/checkin`, state: { officeId: this.props.location.state.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Scan To Check In</Button>
                    </Link>
                    <Link to={{ pathname: `/${this.props.match.params.officeName}/report`, state: { officeId: this.props.location.state.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Report</Button>
                    </Link>
                    {!!window.localStorage.access_token && <Link to={{ pathname: `/${this.props.match.params.officeName}/add-book`, state: { officeId: this.props.location.state.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Add Book</Button>
                    </Link>}
                </div>
                <SearchBar
                    value={this.state.searchCriteria}
                    onCancelSearch={this.fetchBooks}
                    onRequestSearch={(searchCriteria) => this.search(searchCriteria)}
                    style={{
                        margin: '10px auto',
                        maxWidth: 800
                    }}
                />
                {this.state.books.length > 0 && <div style={{ marginLeft: '10px' }}>Results: {this.state.books.length}</div>}
                {this.state.books.length === 0 && this.state.searchCriteria.length > 0 && <div style={{ marginLeft: '10px' }}>No books matching [{this.state.searchCriteria}]</div>}
                <Inventory checkoutBook={this.checkoutBook} books={this.state.books} canDelete={!!window.localStorage.access_token} handleDelete={this.handleDelete} />
            </div>
        )
    }
}

Office.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
}

export default Office