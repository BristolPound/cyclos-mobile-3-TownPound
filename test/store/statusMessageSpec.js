import reducer from '../../src/store/reducer/statusMessage'
import color from '../../src/util/colors'
var expect = require('chai').expect

const initialState = {
  message: '',
  backgroundColor: undefined
}

const ERROR_SEVERITY = {
  MILD: color.bristolBlue,
  SEVERE: color.orange
}

describe('StatusMessage reducer', () => {

	it('should return the initial state', () => {
	    expect(
	      	reducer(undefined, {})
	    ).to.deep.equal(initialState)
	  })

	it('should handle UPDATE_STATUS', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'statusMessage/UPDATE_STATUS',
	        	message: 'status message',
	        	severity: ERROR_SEVERITY.SEVERE
	      	})
	    ).to.deep.equal({
		  	message: 'status message',
        	backgroundColor: color.orange
      	})
	})

	it('should handle login/LOGIN_IN_PROGRESS', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'login/LOGIN_IN_PROGRESS'
	      	})
	    ).to.deep.equal({
	        message: 'Checking details ...',
	        backgroundColor: color.bristolBlue
	    })
	})

	it('should handle login/LOGGED_IN', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'login/LOGGED_IN'
	      	})
	    ).to.deep.equal({
	        message: 'Logged in ✓',
	        backgroundColor: color.bristolBlue
	    })
	})
})
