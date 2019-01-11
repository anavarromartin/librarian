import React, { Component } from 'react'
import Manage from './Manage'
import Inventory from '../Inventory/Inventory'
import { toast } from 'react-toastify'

class ManageContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            books: []
        }

        this.fetchBooks = this.fetchBooks.bind(this)
        this.saveBook = this.saveBook.bind(this)
    }

    componentDidMount() {
        this.fetchBooks()
    }

    async fetchBooks() {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books`

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

    async saveBook(bookTitle, candidateISBN, authors, imageLink) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/1/books`

        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name: bookTitle,
                isbn: candidateISBN,
                authors: authors,
                imageLink: imageLink,
            }),
        }).then(response => {
            if (response.ok) {
                return response
            } else {
                throw Error(`Request rejected with status ${response.status}`)
            }
        }).then(_ => {
            toast('Book saved!')
            this.fetchBooks()
        }).catch(error => {
            throw error
        })
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{this.props.match.params.officeName.charAt(0).toUpperCase() + this.props.match.params.officeName.slice(1)}</span>
                </div>
                <Manage officeName={this.props.match.params.officeName} saveBook={this.saveBook} />
                <Inventory books={this.state.books} />
            </div>
        )
    }
}

export default ManageContainer