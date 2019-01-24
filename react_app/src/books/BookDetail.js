import React, { Component } from 'react'
import Header from '../common/Header'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        overflowY: 'scroll',
        height: 'calc(100vh - 135px)',
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

class BookDetailPage extends Component {
    constructor(props) {
        super(props)

        this.formatDate = this.formatDate.bind(this)
        this.orderCheckoutHistories = this.orderCheckoutHistories.bind(this)
    }

    orderCheckoutHistories(checkoutHistories) {
        const stillCheckedOut = checkoutHistories.filter(function (checkoutHistory) {
            return !!!checkoutHistory.checkin_time
        }).sort(function (a, b) {
            return new Date(b.checkout_time) - new Date(a.checkout_time)
        })

        const checkedIn = checkoutHistories.filter(function (checkoutHistory) {
            return !!checkoutHistory.checkin_time
        }).sort(function (a, b) {
            return new Date(b.checkout_time) - new Date(a.checkout_time)
        })

        return [...stillCheckedOut, ...checkedIn]
    }

    formatDate(dateTime) {
        return moment(new Date(dateTime)).format('LLLL')
    }

    calculateCheckOutDuration(checkoutHistory) {
        let ms = moment().diff(moment(new Date(checkoutHistory.checkout_time)))

        if (!!checkoutHistory.checkin_time) {
            ms = moment(new Date(checkoutHistory.checkin_time)).diff(moment(new Date(checkoutHistory.checkout_time)))
        }

        return moment.duration(ms).humanize()
    }

    render() {
        const { classes } = this.props
        const { book } = this.props.location.state

        return (
            <div style={{ marginTop: '10px' }}>
                <Header officeName={this.props.match.params.officeName} />
                <div>
                    <Link to={{ pathname: `/${this.props.match.params.officeName}`, state: { officeId: this.props.location.state.officeId } }} style={{ textDecoration: 'none', marginRight: '10px', marginLeft: '10px' }}>
                        <Button variant="contained" color="primary">Back</Button>
                    </Link>
                </div>
                <Paper className={classes.root}>
                    <img style={{ height: '120px' }} src={book.imageLink} alt='Missing Link' />
                    <div>Book Title: {book.name}</div>
                    <div>ISBN: {book.isbn}</div>
                    <div>Authors: {book.authors}</div>
                    <div>Category: {book.category}</div>
                    <div>Quantity: {book.quantity}</div>
                    <div>Available Quantity: {book.available_quantity}</div>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Borrower Email</TableCell>
                                <TableCell>Borrower Name</TableCell>
                                <TableCell>Checkout Date</TableCell>
                                <TableCell>Checkin Date</TableCell>
                                <TableCell>Checkout Duration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.orderCheckoutHistories(book.checkout_histories).map(function (checkoutHistory, index) {
                                return (
                                    <TableRow key={index} className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row">{checkoutHistory.email}</TableCell>
                                        <TableCell>{checkoutHistory.name}</TableCell>
                                        <TableCell>{this.formatDate(checkoutHistory.checkout_time)}</TableCell>
                                        <TableCell>{!!checkoutHistory.checkin_time ? this.formatDate(checkoutHistory.checkin_time) : ''}</TableCell>
                                        <TableCell>{this.calculateCheckOutDuration(checkoutHistory)}</TableCell>
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

export default withRouter(withStyles(styles)(BookDetailPage))