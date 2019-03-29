import {getCheckedOutBooks, returnBook} from "./book-methods"

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
                                email: 'adr@ia.com'
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
                                email: 'vin@od.com'
                            },
                            {
                                checkin_time: null,
                                name: 'sneha',
                                email: 'sne@ha.com'
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
                id: 2,
                book_name: "I am checked out by two people because there's 2 of me",
                borrower_name: 'sneha',
                borrower_email: 'sne@ha.com'
            },
        ]
    )
})

it('returns book', async () => {
    await expect(returnBook(1, (url, body) => ([url, body]))).resolves.toEqual([
        'http://localhost/api/books/1?checkout=false',
        {
            name: 'N/A',
            email: 'N/A'
        }
    ])
})