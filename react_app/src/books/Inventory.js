import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

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

const Inventory = (props) => {
    const { classes } = props;

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
                        {props.canDelete && <TableCell align="center">Remove?</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.books.map(book => {
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
                                {props.canDelete && <TableCell align="center">
                                    <Button style={{ background: 'red', color: 'white' }}
                                        variant="contained"
                                        color="inherit"
                                        onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) props.handleDelete(book.id) }}
                                    >
                                        DELETE
                                    </Button>
                                </TableCell>}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </Paper>
    )
}

Inventory.propTypes = {
    classes: PropTypes.object.isRequired,
    books: PropTypes.array.isRequired,
    handleDelete: PropTypes.func.isRequired,
    canDelete: PropTypes.bool.isRequired,
}

export default withStyles(styles)(Inventory)
