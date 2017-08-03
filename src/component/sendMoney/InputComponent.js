import React from 'react'
import animateTo from '../../util/animateTo'
import Price from '../Price'
import commonStyle from '../style'
 import Colors from '@Colors/colors'
import DefaultText from '../DefaultText'
import merge from '../../util/merge'
import KeyboardComponent from '../KeyboardComponent'
import { View, TextInput, TouchableOpacity, Animated, Image } from 'react-native'
import styles from './InputComponentStyle'
import Images from '@Assets/images'

const BalanceMessage = ({ balance }) => {
  return (
    <View style={styles.balanceContainer}>
      <DefaultText style={commonStyle.sectionHeader.text}>CURRENT BALANCE</DefaultText>
      <View style={styles.priceContainer}>
        <Image source={Images.balanceSymbol}/>
        <Price prefix=''
            price={balance}
            size={30}
            color={Colors.primaryBlue}/>
      </View>
    </View>
  )
}

class InputComponent extends KeyboardComponent {
  getButtonColor () {
    if (this.props.invalidInput || this.props.buttonText === 'No payment available') {
      return Colors.offWhite
    }
    return Colors.primaryBlue
  }

  getButtonTextColor () {
    return this.getButtonColor() === Colors.offWhite ? 'black' : 'white'
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
      descriptionInput,
      pinInput,
      invalidInput,
      accessibilityLabel,
      balance,
      amount,
      description,
      onChangeAmount,
      payee,
      offlinePaymentLabel
    } = this.props

    const button = <View style={merge(styles.button, { backgroundColor: this.getButtonColor() })}>
      <DefaultText style={merge(styles.buttonText, { color: this.getButtonTextColor() })}>
        {buttonText}
      </DefaultText>
      {offlinePaymentLabel &&
        <DefaultText style={styles.noInternetMessage}>
          {offlinePaymentLabel}
        </DefaultText>}
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
                <View style={styles.separator}/>
                {pinInput
                  ? <TextInput style={styles.textInput}
                      {...pinInput}
                      accessibilityLabel={pinInput.placeholder} />
                  : <TextInput style={styles.textInput}
                      {...descriptionInput}
                      accessibilityLabel={descriptionInput.placeholder} />
                }
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
                  {description.trim() != "" &&
                  <View style={styles.confirmDescriptionContainer}>
                    <DefaultText style={styles.confirmDescriptionText}>
                      {description}
                    </DefaultText>
                  </View>}
                  <View style={styles.confirmAmountContainer}>
                    <Image source={Images.balanceSymbol}/>
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
