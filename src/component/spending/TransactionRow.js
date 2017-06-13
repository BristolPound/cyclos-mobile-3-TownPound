import React from 'react'
import { View, TouchableHighlight, Animated, Image } from 'react-native'
import ProfileImage from '../profileImage/ProfileImage'
import Price from '../Price'
import Images from '@Assets/images'
import Colors from '@Colors/colors'
import styles from './spendingStyle'
import DefaultText, { MultilineText } from '../DefaultText'
import merge from '../../util/merge'
import animateTo from '../../util/animateTo'


class TransactionRow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false,
      height: new Animated.Value(0),
      spinValue: new Animated.Value(0),
      spin: '0deg',
      minHeight: styles.row.container.height,
      maxHeight: styles.description.container.height
    }

    this.icons = {
      'expand': Images.expandTab
    }

    this.state.height.setValue(this.state.minHeight)

    this.toggle = this.toggle.bind(this)


  }

  _setMaxHeight(event) {
    this.setState({
        maxHeight: event.nativeEvent.layout.height
    })
  }

  toggle() {
    console.log("toggled");

    let initialValue = this.state.expanded
      ? this.state.maxHeight + this.state.minHeight
      : this.state.minHeight

    let finalValue = this.state.expanded
      ? this.state.minHeight
      : this.state.maxHeight + this.state.minHeight

    let initialRotation = this.state.expanded
      ? 0.5
      : 0

    let finalRotation = this.state.expanded
      ? 0
      : 0.5

    this.setState( {
      expanded: !this.state.expanded
    })

    // Spring animation or ease animation (animateTo util)?
    this.state.height.setValue(initialValue)
    Animated.spring(
      this.state.height,
      {
        toValue: finalValue
      }
    ).start()

    animateTo(this.state.spinValue, finalRotation, 300)

    this.state.spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-360deg']
    })

  }

  render() {
    const {
      transaction,
      openDetailsModal,
      businessList,
      getTransactionImage,
      getUserCategory
    } = this.props

    let icon = this.icons['expand']

    return (
      <Animated.View style={merge(styles.container, {height: this.state.height})}>
        <TouchableHighlight
          onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user)}
          underlayColor={Colors.transparent}
          key={transaction.transactionNumber}>
          <View style={styles.tab.container}>
            <View style={styles.row.container}>
              <ProfileImage
                image={getTransactionImage(transaction.relatedAccount.user, businessList)}
                style={styles.row.image}
                category={getUserCategory(transaction.relatedAccount.user, businessList)}
                colorCode={transaction.colorCode}/>
              <View style={styles.row.textContainer}>
                <DefaultText style={styles.row.text}>
                  { transaction.relatedAccount.user ? transaction.relatedAccount.user.display : 'System' }
                </DefaultText>
                <Price price={transaction.amount} style={styles.row.price} size={22}/>
              </View>
              <TouchableHighlight
                style={styles.row.button}
                onPress={this.toggle}
                underlayColor={Colors.transparent}>
                <Animated.Image
                  style={merge(styles.row.buttonImage, {transform: [{rotate: this.state.spin}]})}
                  source={icon}
                ></Animated.Image>
              </TouchableHighlight>
            </View>
            <View style={styles.description.container} >
              <DefaultText style={merge(styles.row.text)}>
                Description: { transaction.description }
              </DefaultText>
            </View>

          </View>
        </TouchableHighlight>
      </Animated.View>
    )

  }

}

export default TransactionRow
