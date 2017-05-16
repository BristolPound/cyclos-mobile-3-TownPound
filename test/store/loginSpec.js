import reducer from '../../src/store/reducer/login'
var expect = require('chai').expect

const LOGIN_STATUSES = {
  LOGGED_IN: 'LOGGED_IN',
  LOGGED_OUT: 'LOGGED_OUT',
  LOGIN_IN_PROGRESS: 'LOGIN_IN_PROGRESS'
}

const initialState = {
  	loginStatus: LOGIN_STATUSES.LOGGED_OUT,
  	loginFormOpen: false,
  	loggedInUsername: '',
  	failedAttempts: []
}

describe('Login reducer', () => {

	it('should return the initial state', () => {
	    expect(
	      	reducer(undefined, {})
	    ).to.deep.equal(initialState)
	  })

	it('should handle LOGGED_IN', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'login/LOGGED_IN',
	        	username: 'Bob'
	      	})
	    ).to.deep.equal({
		  	loginStatus: LOGIN_STATUSES.LOGGED_IN,
		  	loginFormOpen: false,
		  	loggedInUsername: 'Bob',
		  	failedAttempts: []
		})
	})

	it('should handle LOGGED_OUT', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'login/LOGGED_OUT'
	      	})
	    ).to.deep.equal({
		  	loginStatus: LOGIN_STATUSES.LOGGED_OUT,
		  	loginFormOpen: false,
		  	loggedInUsername: '',
		  	failedAttempts: []
		})
	})

	it('should handle LOGIN_IN_PROGRESS', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'login/LOGIN_IN_PROGRESS'
	      	})
	    ).to.deep.equal({
		  	loginStatus: LOGIN_STATUSES.LOGIN_IN_PROGRESS,
		  	loginFormOpen: false,
		  	loggedInUsername: '',
		  	failedAttempts: []
		})
	})

	it('should handle OPEN_LOGIN_FORM', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'login/OPEN_LOGIN_FORM',
	        	open: true
	      	})
	    ).to.deep.equal({
		  	loginStatus: LOGIN_STATUSES.LOGGED_OUT,
		  	loginFormOpen: true,
		  	loggedInUsername: '',
		  	failedAttempts: []
		})
	})

	it('should handle ATTEMPT_FAILED', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'login/ATTEMPT_FAILED',
	        	username: 'Bob'
	      	})
	    ).to.deep.equal({
		  	loginStatus: LOGIN_STATUSES.LOGGED_OUT,
		  	loginFormOpen: false,
		  	loggedInUsername: '',
		  	failedAttempts: [{username: 'Bob', noOfFails: 1}]
		})
	})


	it('should handle another ATTEMPT_FAILED', () => {
	    expect(
	      	reducer({
			  	loginStatus: LOGIN_STATUSES.LOGGED_OUT,
			  	loginFormOpen: false,
			  	loggedInUsername: '',
			  	failedAttempts: [{username: 'Bob', noOfFails: 1}]
			}, {
	        	type: 'login/ATTEMPT_FAILED',
	        	username: 'Bob'
	      	})
	    ).to.deep.equal({
		  	loginStatus: LOGIN_STATUSES.LOGGED_OUT,
		  	loginFormOpen: false,
		  	loggedInUsername: '',
		  	failedAttempts: [{username: 'Bob', noOfFails: 2}]
		})
	})
})
