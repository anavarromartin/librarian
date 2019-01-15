import React, { Component } from 'react'
import Scanner from '../scanner/Scanner'
import './AddBook.css'
import { Line } from 'rc-progress'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const initialState = {
    scanning: false,
    results: [],
    bookTitle: '',
    candidateISBN: '',
    imageLink: '',
    authors: '',
    category: '',
    quantity: 1,
    error: null
}

const SCAN_THRESHOLD_SIZE = 20

class AddBook extends Component {
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
        this._percentage = this._percentage.bind(this)
    }

    // TODO: figure out how to do a secondary sort when a > b
    mode(arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).pop()
    }

    async getBookDetails(isbn) {
        var url = `${process.env.REACT_APP_BOOK_API_URL}${isbn}`

        const response = await fetch(url)
        const res = await response.json()

        if (res.totalItems) {
            const book = res.items[0];

            const title = book['volumeInfo']['title']
            const authors = book['volumeInfo']['authors'].join(', ')
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
                category: '',
                quantity: 1,
                error: 'ISBN not found'
            })
        }
    }

    _saveBook(e) {
        e.preventDefault()

        this.props.saveBook(
            this.state.bookTitle,
            this.state.candidateISBN,
            this.state.authors,
            this.state.imageLink,
            this.state.category,
            this.state.quantity,
        ).then(_ => {
            this.setState(initialState)
        })
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    render() {
        return (
            <div>
                <div>
                    <Link to={{ pathname: `/${this.props.officeName}`, state: { officeId: this.props.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Back</Button>
                    </Link>
                    <Button onClick={this._scan} variant="contained" color="primary">{this.state.scanning ? 'Stop Scanning' : 'Scan Book ISBN'}</Button>
                </div>
                {this.state.scanning && <div style={{ marginTop: '10px', marginBottom: '10px', maxWidth: '500px' }}><Line percent={this._percentage()} strokeWidth="1" strokeColor="#7ce26c" /></div>}
                {this.state.scanning && <div><div>Scanning<span className={this.state.scanning ? 'loader__dot' : null}>.</span><span className={this.state.scanning ? 'loader__dot' : null}>.</span><span className={this.state.scanning ? 'loader__dot' : null}>.</span></div><Scanner onDetected={this._onDetected} /></div>}
                <div style={{ margin: '10px' }}>
                    {this._resultThresholdAchieved() && !this.state.scanning && <img src={this.state.imageLink} alt='Missing' />}
                    {this._resultThresholdAchieved() && !this.state.scanning && <div>{this.state.error}</div>}
                </div>
                <Paper>
                    <form style={{ margin: '20px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '2em' }}>Add Book</div>
                        <div>
                            <TextField
                                label="ISBN"
                                value={this.state.candidateISBN}
                                onChange={this.handleChange('candidateISBN')}
                                margin="normal"
                                required={true}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Title"
                                value={this.state.bookTitle}
                                onChange={this.handleChange('bookTitle')}
                                margin="normal"
                                required={true}
                                style={{ width: '20%' }}
                            />
                        </div>
                        <div>
                            <TextField
                                label="Author(s)"
                                value={this.state.authors}
                                onChange={this.handleChange('authors')}
                                margin="normal"
                                required={true}
                            />
                        </div>
                        <div>
                            <FormControl style={{margin: '10px 0'}}>
                                <InputLabel htmlFor="category-helper">Category</InputLabel>
                                <Select
                                    value={this.state.category}
                                    onChange={this.handleChange('category')}
                                    input={<Input name="age" id="category-helper" />}
                                    style={{width: '165px'}}
                                >
                                    <MenuItem value={'Product'}>Product</MenuItem>
                                    <MenuItem value={'Design'}>Design</MenuItem>
                                    <MenuItem value={'Engineering'}>Engineering</MenuItem>
                                    <MenuItem value={'D&I'}>D&I</MenuItem>
                                    <MenuItem value={'Other'}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <TextField
                                label="Quantity"
                                value={this.state.quantity}
                                onChange={this.handleChange('quantity')}
                                margin="normal"
                                required={true}
                                type="number"
                            />
                        </div>
                        <Button
                            style={{ margin: '20px 0' }}
                            type='submit'
                            variant="contained"
                            color="secondary"
                            onClick={this._saveBook}
                            disabled={!(!!this.state.bookTitle && !!this.state.authors && !!this.state.candidateISBN)}
                        >
                            Add Book
                        </Button>
                    </form>
                </Paper>
            </div>
        )
    }

    _percentage() {
        return (this.state.results.length / SCAN_THRESHOLD_SIZE) * 100
    }

    _resultThresholdAchieved() {
        return this.state.results.length >= SCAN_THRESHOLD_SIZE
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
        return nextResults.length >= SCAN_THRESHOLD_SIZE
    }
}

AddBook.propTypes = {
    officeId: PropTypes.number.isRequired,
    officeName: PropTypes.string.isRequired,
    saveBook: PropTypes.func.isRequired,
}

export default AddBook
