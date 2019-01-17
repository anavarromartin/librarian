import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './AddBook.css'
import AddBook from './AddBook'
import { toast } from 'react-toastify'
import Header from '../common/Header'

class AddBookPage extends Component {
    constructor(props) {
        super(props)

        this.saveBook = this.saveBook.bind(this)
    }

    async saveBook(bookTitle, candidateISBN, authors, imageLink, category, quantity) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/${this.props.location.state.officeId}/books`

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.localStorage.access_token}`,
            },
            body: JSON.stringify({
                name: bookTitle,
                isbn: candidateISBN,
                authors: authors,
                imageLink: imageLink,
                category: category,
                quantity: quantity,
            }),
        })

        if (!response.ok) {
            throw Error(`Request rejected with status ${response.status}`)
        }

        toast('Book saved!')
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <Header {...this.props} />
                <AddBook officeName={this.props.match.params.officeName}
                    saveBook={this.saveBook}
                    officeId={this.props.location.state.officeId}
                />
            </div>
        )
    }
}

AddBookPage.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
}

export default AddBookPage