import React from 'react'
import { View, TouchableHighlight, Animated, Image, Text } from 'react-native'
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
      height: new Animated.Value(),
      spinValue: new Animated.Value(-0.25),
      spin: '-90deg',
      minHeight: styles.row.container.height,
    }

    this.icons = {
      'expand': Images.expandTab
    }

    this.toggle = this.toggle.bind(this)

  }


  _setMinHeight(event) {
    this.state.height.setValue(this.state.minHeight)
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
      ? 0
      : -0.25

    let finalRotation = this.state.expanded
      ? -0.25
      : 0

    this.setState( {
      expanded: !this.state.expanded
    })

    this.state.height.setValue(initialValue)
    Animated.spring(
      this.state.height,
      {
        toValue: finalValue
      }
    ).start()

    animateTo(this.state.spinValue, finalRotation, 300)

    this.state.spin = this.state.spinValue.interpolate({
      inputRange: [-0.25, 0],
      outputRange: ['-90deg', '0deg']
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

    let userEnteredDescription = transaction.description != "Online Payment from Individual Account"

    return (
      <Animated.View style={merge(styles.container, {height: this.state.height})}>
        <TouchableHighlight
          onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user)}
          underlayColor={Colors.transparent}
          key={transaction.transactionNumber}>
          <View style={styles.tab.container}>
            <View style={styles.row.container} onLayout={this._setMinHeight.bind(this)}>
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
              {userEnteredDescription &&
              <View>
                <TouchableHighlight
                  style={styles.row.button}
                  onPress={this.toggle}
                  underlayColor={Colors.transparent}>
                  <Animated.Image
                    style={merge(styles.row.buttonImage, {transform: [{rotate: this.state.spin}]})}
                    source={icon}
                  ></Animated.Image>
                </TouchableHighlight>
              </View>}
            </View>
            {userEnteredDescription &&
            <View style={styles.description.container} onLayout={this._setMaxHeight.bind(this)}>
              <Text style={merge(styles.row.text)}>
                Description: { transaction.description }
              </Text>
            </View>}
          </View>
        </TouchableHighlight>
      </Animated.View>
    )

  }

}

export default TransactionRow
