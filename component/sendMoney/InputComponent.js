import React from 'react'
import animateTo from '../../util/animateTo'
import Price from '../Price'
import commonStyle from '../style'
import color from '../../util/colors'
import DefaultText from '../DefaultText'
import merge from '../../util/merge'
import KeyboardComponent from '../KeyboardComponent'
import { View, TextInput, TouchableOpacity, Animated, Image } from 'react-native'
import styles from './InputComponentStyle'

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
    let { 
      onButtonPress, 
      buttonText, 
      input, 
      invalidInput, 
      accessibilityLabel, 
      balance, 
      amount, 
      onChangeAmount, 
      payee 
    } = this.props

    const button = <View style={merge(styles.button, { backgroundColor: this.getButtonColor() })}>
      <DefaultText style={merge(styles.buttonText, { color: this.getButtonTextColor() })}>
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
            ? <TouchableOpacity onPress={onChangeAmount}>
                <View style={styles.confirmContainer}>
                  <View style={styles.confirmPayeeContainer}>
                    <DefaultText style={styles.confirmPayeeText}>
                      {payee}
                    </DefaultText>
                  </View>
                  <View style={styles.confirmAmountContainer}>
                    <Image source={require('../tabbar/assets/balance_symbol.png')}/>
                    <Price prefix=''
                        price={amount}
                        size={24}
                        color={'black'}/>
                  </View>
                </View>
              </TouchableOpacity>
              : undefined
          }

        </Animated.View>
      )
    
  }
}

export default InputComponent