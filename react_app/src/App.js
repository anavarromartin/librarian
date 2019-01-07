import React, { Component } from 'react'
import Scanner from './Scanner'
import Result from './Result'

class App extends Component {

    constructor(props){
      super(props)
      this.state = {
            scanning: false,
            results: [],
            bookTitle: null,
            candidateISBN: null,
            imageLink: null
      }

      this._scan = this._scan.bind(this)
      this._onDetected = this._onDetected.bind(this)
      this._continueScanning = this._continueScanning.bind(this)
      this._reachedMaxResults = this._reachedMaxResults.bind(this)
      this.mode = this.mode.bind(this)
    }

    // TODO: figure out how to do a secondary sort when a > b
    mode(arr) {
      return arr.sort((a,b) =>
         arr.filter(v => v===a).length - arr.filter(v => v===b).length
      ).pop()
    }

    getBookDetails(isbn) {
      var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn

      fetch(url).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
          }))
        ).then(res => {
            if (res.data.totalItems) {
              var book = res.data.items[0];
            
              var title = (book["volumeInfo"]["title"])
              var subtitle = (book["volumeInfo"]["subtitle"])
              var authors = (book["volumeInfo"]["authors"])
              var printType = (book["volumeInfo"]["printType"])
              var pageCount = (book["volumeInfo"]["pageCount"])
              var publisher = (book["volumeInfo"]["publisher"])
              var publishedDate = (book["volumeInfo"]["publishedDate"])
              var webReaderLink = (book["accessInfo"]["webReaderLink"])
              var imageLink = (book["volumeInfo"]["imageLinks"]["thumbnail"])

              this.setState({
                bookTitle: title,
                imageLink: imageLink
              })
            }
      }).catch(error => {
          this.setState({
            bookTitle: 'something went wrong'
          })

          throw error
      })
    }

    render() {
        return (
            <div>
                <button onClick={this._scan}>{this.state.scanning ? 'Stop' : 'Start'}</button>
                <ul className="results">
                    {this.state.results.map((result) => (<Result key={result.codeResult.code} result={result} />))}
                </ul>
                <div>{this.state.results.length >= 10 && !this.state.scanning && this.state.candidateISBN}</div>
                <div>{this.state.results.length >= 10 && !this.state.scanning && this.state.bookTitle}</div>
                {this.state.results.length >= 10 && !this.state.scanning && <img src={this.state.imageLink} />}
                {this.state.scanning ? <div><div>Scanning...</div><Scanner onDetected={this._onDetected}/></div> : <div>Not Scanning</div>}
            </div>
        );
    }

    _scan() {
        this.setState({results: [], scanning: !this.state.scanning})
    }

    _onDetected(result) {
        const nextResults = this.state.results.concat([result])
        this.setState(
            {
                results: nextResults,
                scanning: this._continueScanning(nextResults)
            }
        )

        if(this._reachedMaxResults(nextResults)) {
            const candidateISBN = this.mode(this.state.results.map((result) => result.codeResult.code))
            this.setState({
                candidateISBN: candidateISBN
            })
            this.getBookDetails(candidateISBN)
        }
        return this._reachedMaxResults(nextResults)
    }

    _continueScanning(nextResults) {
        if(this._reachedMaxResults(nextResults)) {
            return false
        }

        return this.state.scanning
    }

    _reachedMaxResults(nextResults) {
        return nextResults.length >= 10
    }
}

export default App
