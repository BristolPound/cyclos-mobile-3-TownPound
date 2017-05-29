var React = require('react');
var ReactNative = require('react-native');
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
var {
  Alert,
  View,
} = ReactNative;

import { resetForm, askToContinuePayment } from '../store/reducer/sendMoney'

class ContinuePaymentAlert extends React.Component {
    returnToPayment() {
        this.props.askToContinuePayment(false)
    }

    clearPayment() {
        this.props.askToContinuePayment(false)
        this.props.resetForm()
    }

    render() {
        return (
            Alert.alert(
                'Return',
                'Would you like to go back to finish your payment?',
                [
                    {text: 'No', onPress: () => this.clearPayment()},
                    {text: 'Yes', onPress: () => this.returnToPayment()},
                ]
            )
        )
    }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ resetForm, askToContinuePayment }, dispatch)

export default connect(mapDispatchToProps)(ContinuePaymentAlert)