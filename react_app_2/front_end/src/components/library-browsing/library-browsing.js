import React from 'react';
import BookSummary from "../book-summary/book-summary";
import './library-browsing.scss'
import loadingIcon from "../../assets/LoadingIconBookshelfApp.gif";

const LibraryBrowsingRenderer = ({
                                     books = [],
                                     history,
                                     office,
                                 }) => (

    books.length > 0
        ?
        <div className={"library-browsing__container"}>
            {
                books
                    .map((book) => (
                        <div
                            key={book.id}
                            className={"library-browsing__book"}
                            onClick={() => {
                                console.log(`BOOK: ${JSON.stringify(book)}`)
                                history.push(`/${office.name.toLowerCase()}/books/${book.isbn}`)
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
        :
        <div className={"library-browsing__loading"}>
            <img className={"library-browsing__loading-icon"} src={loadingIcon} alt={"loading image"}/>
        </div>

)

class LibraryBrowsing extends React.Component {
    state = {books: []}

    componentDidMount() {
        this.props.setBackLocation && this.props.setBackLocation(null)
        this.props.setHeaderConfig && this.props.setHeaderConfig({
            displayButtons: true
        })
        this.props.getOfficeBooks && this.props.getOfficeBooks(this.props.office.id)
            .then(fetchedBooks => this.setState({books: fetchedBooks}))
    }

    render() {
        return <LibraryBrowsingRenderer
            books={this.state.books}
            history={this.props.history}
            office={this.props.office}
            setHeaderConfig={this.props.setHeaderConfig}
            setBackLocation={this.props.setBackLocation}
        />
    }
}


export default LibraryBrowsing