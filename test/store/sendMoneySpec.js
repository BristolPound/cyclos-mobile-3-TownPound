import reducer from '../../src/store/reducer/sendMoney'
var expect = require('chai').expect

const initialState = {
  payeeId: '',
  amount: '',
  amountPaid: '',
  loading: false,
  success: undefined,
  message: '',
  timestamp: undefined,
  inputPage: 0,
  transactionNumber: -1,
  resetClipboard: false
}

const Page = {
  Ready: 0,
  EnterAmount: 1,
  ConfirmAmount: 2,
  MakingPayment: 3,
  PaymentComplete: 4
}

describe('SendMoney reducer', () => {

	it('should return the initial state', () => {
	    expect(
	      	reducer(undefined, {})
	    ).to.deep.equal(initialState)
	  })

	it('should handle UPDATE_PAYEE', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'sendMoney/UPDATE_PAYEE',
	        	payeeId: 123
	      	})
	    ).to.deep.equal({
		  	payeeId: 123,
		  	amount: '',
		  	amountPaid: '',
		  	loading: false,
		  	success: undefined,
		  	message: '',
		  	timestamp: undefined,
		  	inputPage: 0,
		  	transactionNumber: -1,
  			resetClipboard: false
		})
	})

	it('should handle UPDATE_AMOUNT', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'sendMoney/UPDATE_AMOUNT',
	        	amount: 5
	      	})
	    ).to.deep.equal({
		  	payeeId: '',
		  	amount: 5,
		  	amountPaid: '',
		  	loading: false,
		  	success: undefined,
		  	message: '',
		  	timestamp: undefined,
		  	inputPage: 0,
		  	transactionNumber: -1,
  			resetClipboard: false
		})
	})

	it('should handle SET_LOADING', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'sendMoney/SET_LOADING'
	      	})
	    ).to.deep.equal({
		  	payeeId: '',
		  	amount: '',
		  	amountPaid: '',
		  	loading: true,
		  	success: undefined,
		  	message: '',
		  	timestamp: undefined,
		  	inputPage: 0,
		  	transactionNumber: -1,
  			resetClipboard: false
		})
	})

	it('should handle UPDATE_PAGE', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'sendMoney/UPDATE_PAGE',
	        	page: Page.EnterAmount
	      	})
	    ).to.deep.equal({
		  	payeeId: '',
		  	amount: '',
		  	amountPaid: '',
		  	loading: false,
		  	success: undefined,
		  	message: '',
		  	timestamp: undefined,
		  	inputPage: Page.EnterAmount,
		  	transactionNumber: -1,
        	resetClipboard: false
		})
	})

	it('should handle TRANSACTION_COMPLETE', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'sendMoney/TRANSACTION_COMPLETE',
	        	success: 'Sucess!!!',
	        	message: 'Done',
	        	amountPaid: 5,
	        	timestamp: '10.10.2017',
	        	transactionNumber: '000012'
	      	})
	    ).to.deep.equal({
		  	payeeId: '',
		  	amount: '',
		  	amountPaid: 5,
		  	loading: false,
		  	success: 'Sucess!!!',
		  	message: 'Done',
		  	timestamp: '10.10.2017',
		  	inputPage: Page.PaymentComplete,
		  	transactionNumber: '000012',
  			resetClipboard: false
		})
	})

	it('should handle navigation/OVERLAY_VISIBLE', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'navigation/OVERLAY_VISIBLE',
	        	value: false
	      	})
	    ).to.deep.equal({
		  	payeeId: '',
		  	amount: '',
		  	amountPaid: '',
		  	loading: false,
		  	success: undefined,
		  	message: '',
		  	timestamp: undefined,
		  	inputPage: Page.Ready,
		  	transactionNumber: -1,
          	resetClipboard: true
		})
	})

	it('should handle navigation/SHOW_MODAL', () => {
	    expect(
	      	reducer(initialState, {
	        	type: 'navigation/SHOW_MODAL',
	        	modalState: 'traderScreen'
	      	})
	    ).to.deep.equal({
		  	payeeId: '',
		  	amount: '',
		  	amountPaid: '',
		  	loading: false,
		  	success: undefined,
		  	message: '',
		  	timestamp: undefined,
		  	inputPage: Page.Ready,
		  	transactionNumber: -1,
  			resetClipboard: false
		})
	})
})
