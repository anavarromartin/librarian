import React, { Component } from 'react'
import Scanner from '../Scanner/Scanner'
import './Manage.css'

const initialState = {
    scanning: false,
    results: [],
    bookTitle: null,
    candidateISBN: null,
    imageLink: null,
    authors: null,
    error: null
}

class Manage extends Component {
    constructor(props) {
        super(props)
        this.state = initialState

        this._scan = this._scan.bind(this)
        this._onDetected = this._onDetected.bind(this)
        this._continueScanning = this._continueScanning.bind(this)
        this._reachedMaxResults = this._reachedMaxResults.bind(this)
        this.mode = this.mode.bind(this)
        this._resultThresholdAchieved = this._resultThresholdAchieved.bind(this)
        this._saveBook = this._saveBook.bind(this)
    }

    // TODO: figure out how to do a secondary sort when a > b
    mode(arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).pop()
    }

    async getBookDetails(isbn) {
        var url = `${process.env.REACT_APP_BOOK_API_URL}${isbn}`

        return fetch(url).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            }))
        ).then(res => {
            if (res.data.totalItems) {
                const book = res.data.items[0];

                const title = book['volumeInfo']['title']
                const authors = book['volumeInfo']['authors']
                const imageLinks = book['volumeInfo']['imageLinks']
                const imageLink = imageLinks && imageLinks['thumbnail']

                this.setState({
                    bookTitle: title,
                    authors: authors,
                    imageLink: imageLink,
                    error: ''
                })
            } else {
                this.setState({
                    bookTitle: '',
                    authors: '',
                    imageLink: '',
                    error: 'ISBN not found'
                })
            }
        }).catch(error => {
            this.setState({
                bookTitle: '',
                authors: '',
                imageLink: '',
                error: 'Something went wrong'
            })

            throw error
        })
    }

    _saveBook() {
        this.props.saveBook(
            this.state.bookTitle,
            this.state.candidateISBN
        ).then(_ => {
            this.setState(initialState)
        })
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <button onClick={this._scan}>{this.state.scanning ? 'Stop Scanning' : 'Scan Book ISBN'}</button>
                {this.state.scanning && <div><div>Scanning<span className={this.state.scanning ? 'loader__dot' : null}>.</span><span className={this.state.scanning ? 'loader__dot' : null}>.</span><span className={this.state.scanning ? 'loader__dot' : null}>.</span></div><Scanner onDetected={this._onDetected} /></div>}
                <div>{this._resultThresholdAchieved() && !this.state.scanning && this.state.candidateISBN}</div>
                <div>{this._resultThresholdAchieved() && !this.state.scanning && this.state.bookTitle}</div>
                <div>{this._resultThresholdAchieved() && !this.state.scanning && this.state.authors}</div>
                <div>{this._resultThresholdAchieved() && !this.state.scanning && this.state.error}</div>
                {this._resultThresholdAchieved() && !this.state.scanning && <img src={this.state.imageLink} alt='Missing' />}
                {this._resultThresholdAchieved() && !this.state.scanning && !this.state.error && <div><button type='submit' onClick={this._saveBook}>Add book</button></div>}
            </div>
        )
    }

    _resultThresholdAchieved() {
        return this.state.results.length >= 20
    }

    _scan() {
        this.setState({ results: [], scanning: !this.state.scanning, error: '' })
    }

    _onDetected(result) {
        const nextResults = this.state.results.concat([result])
        this.setState(
            {
                results: nextResults,
                scanning: this._continueScanning(nextResults)
            }
        )

        if (this._reachedMaxResults(nextResults)) {
            const candidateISBN = this.mode(this.state.results.map((result) => result.codeResult.code))
            this.setState({
                candidateISBN: candidateISBN
            })
            this.getBookDetails(candidateISBN)
        }
        return this._reachedMaxResults(nextResults)
    }

    _continueScanning(nextResults) {
        if (this._reachedMaxResults(nextResults)) {
            return false
        }

        return this.state.scanning
    }

    _reachedMaxResults(nextResults) {
        return nextResults.length >= 20
    }
}

export default Manage
