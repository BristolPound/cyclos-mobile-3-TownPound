import React from 'react'
import { View, TextInput, TouchableHighlight, ActivityIndicator, Dimensions, Keyboard } from 'react-native'
import DefaultText from './DefaultText'
import color from '../util/colors'
import merge from '../util/merge'

const { width } = Dimensions.get('window')
const sectionHeight = 40

const styles = {
  container: {
    flex: 0,
    position: 'absolute',
    width: width,
    backgroundColor: 'white'
  },
  buttonContainer: {
    height: sectionHeight,
    backgroundColor: color.bristolBlue2,
    alignItems: 'center',
    justifyContent: 'center',
    width: width
  },
  textInput: {
    width: width,
    padding: 10,
    height: sectionHeight,
    textAlign: 'center'
  },
  textBelowInput: {
    height: sectionHeight,
    backgroundColor: color.grey4,
    alignItems: 'center',
    justifyContent: 'center',
    width: width
  },
  loadingSpinner: {
    backgroundColor: color.transparent,
    marginLeft: 20
  }
}

class InputComponent extends React.Component {

  constructor() {
    super()
    this.state = {
      keyboardOpen: false,
    }
    this._showKeyboard = () => this.setState({keyboardOpen: true})
    this._hideKeyboard = () => this.setState({keyboardOpen: false})
  }

  componentDidMount () {
    Keyboard.addListener('keyboardDidShow', this._showKeyboard)
    Keyboard.addListener('keyboardDidHide', this._hideKeyboard)
  }

  componentWillUnmount() {
    this.props.onRequestClose()
    Keyboard.removeListener('keyboardDidShow', this._showKeyboard)
    Keyboard.removeListener('keyboardDidHide', this._hideKeyboard)
  }

  render() {
    let { onButtonPress, buttonText, loading, input, invalidInput, textBelowInput } = this.props

    return <View style={merge(styles.container, { bottom: this.state.keyboardOpen ? 40 : 0 })}>
      <TouchableHighlight
          onPress={() => !invalidInput && onButtonPress ? onButtonPress() : undefined }>
        <View style={merge(styles.buttonContainer, invalidInput ? {backgroundColor: color.grey} : {})}>
          <View style={{flexDirection: 'row'}}>
            <DefaultText style={{color: 'white'}}>
              {buttonText}
            </DefaultText>

            { loading
              ? <ActivityIndicator size='small' style={styles.loadingSpinner}/>
              : undefined }
          </View>
        </View>
      </TouchableHighlight>

      { input
        ? <TextInput style={styles.textInput} {...input} autoFocus={true} />
        : undefined }

      {textBelowInput
        ? <View style={styles.textBelowInput}>
            <DefaultText>{textBelowInput}</DefaultText>
          </View>
        : undefined}
    </View>
  }
}

export default InputComponent
