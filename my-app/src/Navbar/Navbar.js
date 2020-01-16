import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import firebase from '../firebase.js'

class Navbar extends Component {

	constructor(props) {
		super(props);
		this.state = ({
			email: null,
			status: this.props.model.getUserStatus()
		})
		
		this.addListener();

		this.logOut = this.logOut.bind(this)
		this.update = this.update.bind(this)
		this.showResponsiveBar = this.showResponsiveBar.bind(this)
		this.hideResponsiveBar = this.hideResponsiveBar.bind(this)
	}

	componentDidMount(){
		this.props.model.addObserver(this)
	}

	componentWillUnmount() {
		this.props.model.removeObserver(this)
	}

	// observer som lyssnar efter data från den som är inloggad
	addListener() {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in
				this.setState({
					email: user.email, 
					status: "LoggedIn"
				});
				this.props.model.setUserStatus(this.state.status)
		    } else {
				//User is signed out
				this.setState({
					status: "LoggedOut"
				})
			}
		}.bind(this));
	}

	//Changes the status to logged out both in the model and the state as there are many components looking at the login status
	logOut() {
		firebase.auth().signOut();
		this.props.model.setUserStatus("LoggedOut")
		this.setState({
			userStatus: "LoggedOut",
			email: null
		})
	}

	//Called if notifyObservers are called upon, in order to change the content of the navbar.
	update(){
		this.setState({
			status: this.props.model.getUserStatus()
		})
	}

	//Changes the css (puts features in dropdown menu) if the window is on a media device or smaller than 600 px wide
	showResponsiveBar() {
		var x = document.getElementById("myNavbar");
		if (x.className === "navbar") {
			x.className += " responsive";
		} else {
			x.className = "navbar";
		}
	}

	//Hides the dropdown menu after clicking
	hideResponsiveBar(){
		var x = document.getElementById("myNavbar");
		if (x.className === "navbar responsive") {
			x.className = "navbar";
		} else {
			x.className = "navbar responsive";
		}

	}


	render() {

		let currentStatus = this.state.status
		let profile;
		let loginFeature;
		let library;

		//If the user status is logged out, the login feature showing will be "Log in"
		if(currentStatus === "LoggedOut"){

			library = ""

			loginFeature = 	<Link to="/login" onClick={this.hideResponsiveBar}>
								<span className="glyphicon glyphicon-log-in"></span> Log in
							</Link>

			profile = ""
			
		}
		// If the user is logged in, the login feature showing will be "Log out"
		//Also, there will appear icons to "MyLibrari" and username.
		else{
			library = 		<Link to="/profile" title="Go to MyLibrari" onClick={this.hideResponsiveBar}>
								<span className="glyphicon glyphicon-book"></span> MyLibrari
							</Link>

			loginFeature = 	<Link to="/login" title="Go to MyLibrari" onClick={this.hideResponsiveBar}>
								<span onClick={this.logOut} title="Goodbye!">
									<span className="glyphicon glyphicon-log-out"></span> Log out
								</span>
							</Link>
			profile =		<div className="user">
								<span className="glyphicon glyphicon-user"></span> {this.state.email}
							</div>

		}
		return (
			<div className="navbar" id="myNavbar">
				{library}
				<Link to="/" title="Search for books" onClick={this.hideResponsiveBar}>
					<span className="glyphicon glyphicon-search"></span> Search
				</Link>
				<Link to="/about" title="About" onClick={this.hideResponsiveBar}>
					<span className="glyphicon glyphicon-info-sign"></span> About
				</Link>
				{loginFeature}
				{profile}
				<a href="javascript:void(0)" className="icon" onClick={this.showResponsiveBar}>
    				<span className="glyphicon glyphicon-menu-hamburger"></span>
  				</a>
			
			</div> 
		);
	}
}

export default Navbar;
