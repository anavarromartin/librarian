import {
    getAvailableBooks,
    getCheckedOutBooks,
    returnBook,
    borrowBook,
    getOfficeBooks
} from "./book-methods"

it('search checked out books', async () => {
    await expect(getCheckedOutBooks('book', () => ({
        data: {
            data: {
                books: [
                    {
                        id: 1,
                        name: 'I am checked out',
                        checkout_histories: [
                            {
                                checkin_time: null,
                                name: 'adria',
                                email: 'adr@ia.com',
                                book_id: 1,
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: "I am checked out by two people because there's 2 of me",
                        checkout_histories: [
                            {
                                checkin_time: null,
                                name: 'vinod',
                                email: 'vin@od.com',
                                book_id: 2,
                            },
                            {
                                checkin_time: null,
                                name: 'sneha',
                                email: 'sne@ha.com',
                                book_id: 3,
                            }
                        ]
                    },
                    {
                        name: 'I am not checked out',
                        checkout_histories: []
                    },
                    {
                        name: 'I am also not checked out',
                        checkout_histories: [
                            {
                                checkin_time: 'some time'
                            }
                        ]
                    },
                ]
            }
        }
    }))).resolves.toEqual(
        [
            {
                id: 1,
                book_name: 'I am checked out',
                borrower_name: 'adria',
                borrower_email: 'adr@ia.com'
            },
            {
                id: 2,
                book_name: "I am checked out by two people because there's 2 of me",
                borrower_name: 'vinod',
                borrower_email: 'vin@od.com'
            },
            {
                id: 3,
                book_name: "I am checked out by two people because there's 2 of me",
                borrower_name: 'sneha',
                borrower_email: 'sne@ha.com'
            },
        ]
    )
})

it('search available books', async () => {
    await expect(getAvailableBooks('book', () => ({
        data: {
            data: {
                books: [
                    {
                        id: 1,
                        name: 'I am checked out',
                        available_quantity: 0
                    },
                    {
                        id: 4,
                        name: 'I am available',
                        available_quantity: 2
                    },
                ]
            }
        }
    }))).resolves.toEqual(
        [
            {
                id: 4,
                book_name: "I am available",
            },
        ]
    )
})

it('returns book', async () => {
    await expect(returnBook({
        id: 1,
        borrower_name: 'Amber',
        borrower_email: 'amb@er.com'
    }, (url, body) => ([url, body]))).resolves.toEqual([
        'http://localhost/api/books/1?checkout=false',
        {
            name: 'Amber',
            email: 'amb@er.com'
        }
    ])
})

it('borrows book', async () => {
    await expect(borrowBook(1, 'Amber', 'amb@er.com', (url, body) => ([url, body]))).resolves.toEqual([
        'http://localhost/api/books/1?checkout=true',
        {
            name: 'Amber',
            email: 'amb@er.com'
        }
    ])
})

it('fetches office books', async () => {
    await expect(getOfficeBooks(1, url => {
        expect(url).toContain('/api/offices/1/books')
        return {
            data: {
                data: {
                    books: [
                        {
                            id: 1,
                            name: 'I are book',
                            available_quantity: 0,
                            imageLink: 'link'
                        }
                    ]
                }
            }
        }
    })).resolves.toEqual([{
        id: 1,
        book_name: 'I are book',
        quantity: 0,
        imageLink: 'link'
    }])
})