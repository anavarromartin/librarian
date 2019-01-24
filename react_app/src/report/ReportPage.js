import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Header from '../common/Header'

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

class ReportPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            books: [],
        }

        this.fetchCheckedOutBooks = this.fetchCheckedOutBooks.bind(this)
        this.formatCheckoutDate = this.formatCheckoutDate.bind(this)
        this.getLatestCheckout = this.getLatestCheckout.bind(this)
        this.calculateCheckOutDuration = this.calculateCheckOutDuration.bind(this)
    }

    componentDidMount() {
        this.fetchCheckedOutBooks()
    }

    async fetchCheckedOutBooks() {
        const url = `${process.env.REACT_APP_API_URL || window.location.origin}/api/offices/${this.props.location.state.officeId}/books?checked-out=true`

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

    getLatestCheckout(book) {
        return book.checkout_histories
            .filter(function (checkoutHistory) { return !!!checkoutHistory.checkin_time }, this)[0]
    }

    formatCheckoutDate(book) {
        return moment(new Date(this.getLatestCheckout(book).checkout_time)).format('LLLL')
    }

    calculateCheckOutDuration(book) {
        var ms = moment().diff(moment(new Date(this.getLatestCheckout(book).checkout_time)))
        return moment.duration(ms).humanize()
    }

    render() {
        const { classes } = this.props

        return (
            <div style={{ marginTop: '10px' }}>
                <Header officeName={this.props.match.params.officeName} />
                <div>
                    <Link to={{ pathname: `/${this.props.match.params.officeName}`, state: { officeId: this.props.location.state.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Back</Button>
                    </Link>
                </div>
                <div style={{ fontSize: '4em', fontWeight: 'bold' }}>Current Checkouts</div>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Book Title</TableCell>
                                <TableCell>Borrower Email</TableCell>
                                <TableCell>Borrower Name</TableCell>
                                <TableCell>Checkout Date</TableCell>
                                <TableCell>Checkout Duration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.books.map(function (book, index) {
                                return (
                                    <TableRow key={index} className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row">{book.name}</TableCell>
                                        <TableCell>{this.getLatestCheckout(book).email}</TableCell>
                                        <TableCell>{this.getLatestCheckout(book).name}</TableCell>
                                        <TableCell>{this.formatCheckoutDate(book)}</TableCell>
                                        <TableCell>{this.calculateCheckOutDuration(book)}</TableCell>
                                    </TableRow>
                                )
                            }, this)}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(ReportPage))