import React from 'react'
import { View, TouchableHighlight, Animated } from 'react-native'
import ProfileImage from '../profileImage/ProfileImage'
import Price from '../Price'
import Images from '@Assets/images'


class TransactionRow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false,
      height: new Animated.Value(0)
    }

    this.icons = {
      'expand': Images.Expand_Tab
    }


  }

  toggle() {
    let initialValue = this.state.expanded
      ? this.state.maxHeight + this.state.minHeight
      : this.state.minHeight

    let finalValue = this.state.expanded
      ? this.state.minHeight
      : this.state.maxHeight + this.state.minHeight

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

  }

  render() {
    const { transaction, openDetailsModal, businessList } = this.props

    return (
      <Animated.View>
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
            </View>

          </View>
        </TouchableHighlight>
      </Animated.View>
    )

  }

}

const renderRow = (transaction, openDetailsModal, businessList) =>
    <Animated.View>
      <TouchableHighlight
        onPress={() => transaction.relatedAccount.user && openDetailsModal(transaction.relatedAccount.user)}
        underlayColor={Colors.transparent}
        key={transaction.transactionNumber}>
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
        </View>
      </TouchableHighlight>
    </Animated.View>
