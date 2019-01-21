import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { TextField, FormControl, Input, InputLabel, FormHelperText } from '@material-ui/core'
import { withRouter } from 'react-router'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        overflowY: 'scroll',
        height: 'calc(100vh - 235px)',
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

class Inventory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            book: null,
            name: '',
            email: '',
            checkoutBook: null,
            openCheckoutDialog: false,
        }

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleCheckout = this.handleCheckout.bind(this)
        this._checkoutBook = this._checkoutBook.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.isInvalidEmail = this.isInvalidEmail.bind(this)
        this.navigateToBookDetail = this.navigateToBookDetail.bind(this)
    }

    navigateToBookDetail(book) {
        this.props.history.push({
            pathname: `/${this.props.match.params.officeName}/books/${book.id}`,
            state: {
                officeId: this.props.location.state.officeId,
                book: book,
            }
        })
    }

    handleClickOpen(book) {
        this.setState({
            open: true,
            book: book
        })
    }

    handleClose(shouldDelete, book) {
        if (shouldDelete) {
            this.props.handleDelete(book)
        }
        this.setState({
            open: false
        })
    }

    handleCheckout(book) {
        this.setState({
            openCheckoutDialog: true,
            checkoutBook: book,
        })
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    async _checkoutBook() {
        await this.props.checkoutBook(this.state.checkoutBook, this.state.name, this.state.email)

        this.setState({
            checkoutBook: null,
            openCheckoutDialog: false,
            name: '',
            email: '',
        })
    }

    isInvalidEmail() {
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return this.state.email.length > 0 && !emailRegex.test(String(this.state.email).toLowerCase())
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Check Out?</TableCell>
                            <TableCell>Book Title</TableCell>
                            <TableCell>Authors</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Available Quantity</TableCell>
                            <TableCell>ISBN</TableCell>
                            {this.props.canDelete && <TableCell align="center">Remove?</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.books.map((book, index) => {
                            return (
                                <TableRow key={index} className={classes.tableRowHover} onClick={(e) => { if (e.target.nodeName !== 'SPAN') { this.navigateToBookDetail(book) } }}>
                                    <TableCell>
                                        <img style={{ height: '120px' }} src={book.imageLink} alt='missing' />
                                    </TableCell>
                                    <TableCell>
                                        {book.available_quantity > 0 && <Button variant="contained" color="primary" onClick={() => { this.handleCheckout(book) }}>Check Out</Button>}
                                        {book.available_quantity === 0 && <div>None available</div>}
                                    </TableCell>
                                    <TableCell>{book.name}</TableCell>
                                    <TableCell>{book.authors}</TableCell>
                                    <TableCell>{book.category}</TableCell>
                                    <TableCell>{book.available_quantity} of {book.quantity}</TableCell>
                                    <TableCell>{book.isbn}</TableCell>
                                    {this.props.canDelete && <TableCell align="center">
                                        <Button style={{ background: 'red', color: 'white' }}
                                            variant="contained"
                                            color="inherit"
                                            onClick={() => { this.handleClickOpen(book) }}
                                        >
                                            DELETE
                                    </Button>
                                        <Dialog
                                            open={this.state.open}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                            disableBackdropClick={true}
                                            disableEscapeKeyDown={true}
                                        >
                                            <DialogTitle id="alert-dialog-title">Delete Book?</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Are you sure you want to delete {this.state.book && this.state.book.name}?
                                                    Deleting will remove the first non checked out book unless none are available.
                                            </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => { this.handleClose(false) }} color="primary">
                                                    No
                                            </Button>
                                                <Button onClick={() => { this.handleClose(true, this.state.book) }} color="inherit" style={{ background: 'red', color: 'white' }} autoFocus>
                                                    Yes
                                            </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableCell>}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <Dialog
                    open={this.state.openCheckoutDialog}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                >
                    <DialogTitle>Check Out Book?</DialogTitle>
                    <DialogContent>
                        <div>
                            <FormControl error={this.isInvalidEmail()} aria-describedby="component-error-text">
                                <InputLabel htmlFor="component-error">Email</InputLabel>
                                <Input id="component-error" type="email" required={true} style={{ width: '250px' }} value={this.state.email} onChange={this.handleChange('email')} autoFocus />
                                {this.isInvalidEmail() && <FormHelperText id="component-error-text">Invalid Email Address</FormHelperText>}
                            </FormControl>
                        </div>
                        <div>
                            <TextField
                                label="Borrower Name"
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                required={true}
                                style={{ width: '250px' }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.setState({ openCheckoutDialog: false, checkoutBook: null, name: '', email: '' }) }} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this._checkoutBook} disabled={!(!!this.state.name && !!this.state.email && !this.isInvalidEmail())} variant="contained" color="primary" autoFocus>
                            Yes, Check Out
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        )
    }
}

Inventory.propTypes = {
    classes: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired,
    canDelete: PropTypes.bool.isRequired,
}

export default withRouter(withStyles(styles)(Inventory))
