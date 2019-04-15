import React from 'react';
import BookSummary from "../book-summary/book-summary";
import './library-browsing.scss'

const LibraryBrowsingRenderer = ({
                                     books = [],
                                 }) => (
    <div className={"library-browsing__container"}>
        {
            books
                .map((book) => (
                    <div
                        key={book.id}
                        className={"library-browsing__book"}
                        onClick={() => {
                            // window.location.href = `${process.env.REACT_APP_API_URL || window.location.origin}/Dallas/books/${book.id}`
                        }}

                    >
                        <BookSummary
                            bookTitle={book.book_name}
                            quantity={book.quantity}
                            imageLink={book.imageLink}
                        />
                    </div>
                ))
        }
    </div>
)

class LibraryBrowsing extends React.Component {
    state = {books: []}

    componentDidMount() {
        this.props.setBackLocation && this.props.setBackLocation(null)
        this.props.setHeaderConfig && this.props.setHeaderConfig({
            displayButtons: true
        })
        this.props.getOfficeBooks && this.props.getOfficeBooks(this.props.match.params.officeId)
            .then(fetchedBooks => this.setState({books: fetchedBooks}))
    }

    render() {
        return <LibraryBrowsingRenderer
            books={this.state.books}
            setHeaderConfig={this.props.setHeaderConfig}
            setBackLocation={this.props.setBackLocation}
        />
    }
}


export default LibraryBrowsing