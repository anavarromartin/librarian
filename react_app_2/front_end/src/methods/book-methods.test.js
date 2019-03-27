import {getCheckedOutBooks, returnBook} from "./book-methods"

it('search checked out books', async () => {
    await expect(getCheckedOutBooks('book', url => ({
        data: {
            data: {
                books: [
                    {
                        name: 'I am checked out',
                        checkout_histories: [
                            {
                                checkin_time: null
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
        }}))).resolves.toEqual([
        {
            name: 'I am checked out',
            checkout_histories: [
                {
                    checkin_time: null
                }
            ]
        },
    ])
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