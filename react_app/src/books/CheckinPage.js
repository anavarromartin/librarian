import React, { Component } from 'react'
import Scanner from '../scanner/Scanner'
import './AddBook.css'
import { Line } from 'rc-progress'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
})

const initialState = {
    scanning: true,
    results: [],
    candidateISBN: '',
    error: null,
    books: [],
}

const SCAN_THRESHOLD_SIZE = 20

class CheckinPage extends Component {
    constructor(props) {
        super(props)
        this.state = initialState

        this._scan = this._scan.bind(this)
        this._onDetected = this._onDetected.bind(this)
        this._continueScanning = this._continueScanning.bind(this)
        this._reachedMaxResults = this._reachedMaxResults.bind(this)
        this.mode = this.mode.bind(this)
        this._resultThresholdAchieved = this._resultThresholdAchieved.bind(this)
        this._percentage = this._percentage.bind(this)
        this.getBook = this.getBook.bind(this)
        this.checkinBook = this.checkinBook.bind(this)
    }

    async getBook(isbn) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/${this.props.location.state.officeId}/books/${isbn}`

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

        const res = await response.json()

        this.setState({
            books: res.data.books,
        })
    }

    async checkinBook(book, borrowerName, borrowerEmail) {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/books/${book.id}?checkout=false`

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

        toast(`Thank you! You've checked in ${book.name} by ${book.authors}.`)

        this.getBook(this.state.candidateISBN)
    }

    // TODO: figure out how to do a secondary sort when a > b
    mode(arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).pop()
    }

    bookWithCheckoutHistoryStillCheckedOut() {
        return this.state.books.flatMap(function (book) {
            return book.checkout_histories.filter(function (checkoutHistory) { return !!!checkoutHistory.checkin_time }, this)
                .map(function (checkoutHistory) {
                    return {
                        'book': book,
                        'checkoutHistory': checkoutHistory,
                    }
                }, this)
        }, this)
    }

    render() {
        const { classes } = this.props

        return (
            <div style={{ marginTop: '10px' }}>
                <div>
                    <Link to={{ pathname: `/${this.props.match.params.officeName}`, state: { officeId: this.props.location.state.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Back</Button>
                    </Link>
                    {!this.state.scanning && <Button onClick={this._scan} variant="contained" color="primary">Scan Again</Button>}
                </div>
                {this.state.scanning && <div style={{ marginTop: '10px', marginBottom: '10px', maxWidth: '500px' }}><Line percent={this._percentage()} strokeWidth="1" strokeColor="#7ce26c" /></div>}
                {this.state.scanning && <div><div>Scanning<span className={this.state.scanning ? 'loader__dot' : null}>.</span><span className={this.state.scanning ? 'loader__dot' : null}>.</span><span className={this.state.scanning ? 'loader__dot' : null}>.</span></div><Scanner onDetected={this._onDetected} /></div>}
                <div style={{ margin: '10px' }}>
                    {this._resultThresholdAchieved() && !this.state.scanning && this.state.books.length > 0 && <img src={this.state.books[0].imageLink} alt='Missing' />}
                    {this._resultThresholdAchieved() && !this.state.scanning && this.state.books.length === 0 && <div>Bad Scan, please scan again.</div>}
                    {this._resultThresholdAchieved() && !this.state.scanning && <div>{this.state.error}</div>}
                </div>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Borrower Email</TableCell>
                                <TableCell>Borrower Name</TableCell>
                                <TableCell>Check-In?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.bookWithCheckoutHistoryStillCheckedOut().map(function (bookWithCheckoutHistory, index) {
                                if (!!!bookWithCheckoutHistory.checkoutHistory) {
                                    return;
                                }

                                return (
                                    <TableRow key={index} className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row">{bookWithCheckoutHistory.checkoutHistory.email}</TableCell>
                                        <TableCell>{bookWithCheckoutHistory.checkoutHistory.name}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => { this.checkinBook(bookWithCheckoutHistory.book, bookWithCheckoutHistory.checkoutHistory.name, bookWithCheckoutHistory.checkoutHistory.email) }}>
                                                Check-in
                                        </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            }, this)}
                            {this.state.books.length > 0 &&
                                this.bookWithCheckoutHistoryStillCheckedOut().length === 0 &&
                                <TableRow key={0} className={classes.tableRowHover}>
                                    <TableCell>No Checkouts for this book.</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }

    componentWillUnmount() {
        this.setState({
            scanning: false,
            results: [],
            error: null,
            candidateISBN: '',
            books: [],
        })
    }

    _percentage() {
        return (this.state.results.length / SCAN_THRESHOLD_SIZE) * 100
    }

    _resultThresholdAchieved() {
        return this.state.results.length >= SCAN_THRESHOLD_SIZE
    }

    _scan() {
        this.setState({
            results: [],
            scanning: !this.state.scanning,
            candidateISBN: '',
            error: null,
            books: [],
        })
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
            this.getBook(candidateISBN)
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

export default withRouter(withStyles(styles)(CheckinPage))
