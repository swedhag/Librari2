import React, { Component } from 'react';
import './SearchView.css';
import '../Book/Book.css'
import Search from '../Search/Search';
import SearchResults from '../SearchResults/SearchResults';
import {debounce} from 'throttle-debounce';
import SmallBook from './SmallBook/SmallBook';

class SearchView extends Component {

	constructor(props){
		super(props);

		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.newSearch = debounce(800, this.newSearch);

		this.state = ({
			status: 'INITIAL',
			filter: this.props.model.getQuery()
		})
	}

	componentDidMount() {
    	this.getBooks()
 	}

 	// on change, this handler will update the search string set by the user
  	handleChange(event) {
		this.newSearch(event.target.value);
		this.props.model.setQuery(event.target.value);
  	}

  	//When clicking on book, we change the state activeBookId
  	handleClick(event) {
		this.setState({
			activeBookId: event.target.id
		})

	}

	//In order to not crash, we look if the new searchvalue is not null
	//If it is not, it will call getBooks with the new filter
	//Otherwise, it will reuse the old one.
	newSearch(newFilter) {
		var search = this.state.filter
		this.setState({ 
			status: "INITIAL",
			filter: newFilter !== "" ? newFilter : search
		}, () => this.getBooks());		
	}

	//Calling getAllBooks in the model with the search filter
	getBooks() {
		this.props.model.getAllBooks(this.state.filter).then(books => {
			this.props.model.setSearchResults(books.items);
	      	this.setState({
	        	status: 'LOADED',
	        	searchResults: books,
	     	})
	    }).catch(() => {
	      	this.setState({
	        	status: 'ERROR'
	      })
	    });
	}

 	render() {

 		let bookList = null;
		// For different cases, we display either a message or the returned books
	    switch (this.state.status) {
	      	case 'INITIAL':
				bookList = <em><p className="loading">Loading<span>.</span><span>.</span><span>.</span></p></em>
	        	break;
			case 'LOADED':

				if (this.state.searchResults.items !== undefined) {
					bookList = this.state.searchResults.items.map((book) =>
						<SmallBook key={book.id} book={book} handleClick={this.handleCLick} />)
				} else {
					bookList = "Seems like there are no books matching your search. Try another one!"
				}

	        	break;
	      	default:
	        	bookList = <b>Failed to load data, please try again</b>
	        break;
	    }

	    return (
	      	<div className="SearchView">
	    		<Search handleChange={this.handleChange}/>
	        	<SearchResults results={bookList}/>
	      </div>
	      );
  	}
}


export default SearchView;
