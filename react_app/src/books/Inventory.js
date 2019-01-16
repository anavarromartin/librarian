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

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        overflowY: 'scroll',
        height: 'calc(100vh - 150px)',
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
        }

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClickOpen(book) {
        this.setState({
            open: true,
            book: book
        })
    }

    handleClose(shouldDelete, book_id) {
        if (shouldDelete) {
            this.props.handleDelete(book_id)
        }
        this.setState({
            open: false
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Book Title</TableCell>
                            <TableCell>Authors</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>ISBN</TableCell>
                            {this.props.canDelete && <TableCell align="center">Remove?</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.books.map(book => {
                            return (
                                <TableRow key={book.id} className={classes.tableRowHover}>
                                    <TableCell component="th" scope="row">
                                        <img style={{ height: '120px' }} src={book.imageLink} alt='missing' />
                                    </TableCell>
                                    <TableCell>{book.name}</TableCell>
                                    <TableCell>{book.authors}</TableCell>
                                    <TableCell>{book.category}</TableCell>
                                    <TableCell>{book.quantity}</TableCell>
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
                                            </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => { this.handleClose(false) }} color="primary">
                                                    No
                                            </Button>
                                                <Button onClick={() => { this.handleClose(true, this.state.book && this.state.book.id) }} color="inherit" style={{ background: 'red', color: 'white' }} autoFocus>
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

export default withStyles(styles)(Inventory)
