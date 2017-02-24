import React from 'react'
import { sectionHeight, dimensions, border } from '../../util/StyleUtils'
import animateTo from '../../util/animateTo'
import Price from '../Price'
import commonStyle from '../style'
import color from '../../util/colors'
import DefaultText from '../DefaultText'
import merge from '../../util/merge'
import KeyboardComponent from '../KeyboardComponent'
import { View, TextInput, TouchableOpacity, Dimensions, Animated, Image } from 'react-native'

const { width } = Dimensions.get('window')

const styles = {
  button: {
    height: sectionHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textInput: {
    ...dimensions(width, sectionHeight),
    padding: 10,
    textAlign: 'center'
  },
  balanceContainer: {
    ...border(['bottom'], color.gray5, 1),
    backgroundColor: color.offWhite,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceContainer: {
    flex: 1,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.transparent,
    justifyContent: 'flex-end'
  }
}

const BalanceMessage = ({ balance }) => {
  return (
    <View style={styles.balanceContainer}>
      <DefaultText style={commonStyle.sectionHeader.text}>CURRENT BALANCE</DefaultText>
      <View style={styles.priceContainer}>
        <Image source={require('../tabbar/assets/balance_symbol.png')}/>
        <Price prefix=''
            price={balance}
            size={30}
            color={color.bristolBlue}/>
      </View>
    </View>
  )
}

class InputComponent extends KeyboardComponent {
  getButtonColor () {
    if (this.props.invalidInput) {
      return color.offWhite
    }
    return color.bristolBlue
  }

  getButtonTextColor () {
    return this.getButtonColor() === color.offWhite ? 'black' : 'white'
  }

  componentWillUpdate(nextProps) {
    if (nextProps.accessibilityLabel !== 'Enter Amount') {
      animateTo(this.state.keyboardHeight, 0, 50)
    }
  }

  render () {
    let { onButtonPress, buttonText, input, invalidInput, accessibilityLabel, balance, amount, onChangeAmount } = this.props

    const button = <View style={merge(styles.button, { backgroundColor: this.getButtonColor() })}>
      <DefaultText style={{fontSize: 24, color: this.getButtonTextColor(), textAlign: 'center', width: Dimensions.get('window').width - 20}}>
        {buttonText}
      </DefaultText>
    </View>

    return (
          <Animated.View style={{backgroundColor: 'white', bottom: this.state.keyboardHeight }} accessibilityLabel={accessibilityLabel}>

          {accessibilityLabel === 'Payment complete'
            ? button
            : <TouchableOpacity onPress={invalidInput ? undefined : onButtonPress}>
                {button}
              </TouchableOpacity>}

          {input
            ? <View>
                <TextInput style={styles.textInput}
                    {...input}
                    autoFocus={true}
                    accessibilityLabel={input.placeholder} />
                <BalanceMessage balance={balance}/>
              </View>
            : undefined}
            
          {amount
            ? <TouchableOpacity onPress={onChangeAmount} style={merge(styles.button, { backgroundColor: color.offWhite })}>
                <DefaultText style={{fontSize: 24, color: 'black', textAlign: 'center', width: Dimensions.get('window').width - 20}}>
                  {amount}
                </DefaultText>
              </TouchableOpacity>
              : undefined
          }

        </Animated.View>
      )
    
  }
}

export default InputComponent