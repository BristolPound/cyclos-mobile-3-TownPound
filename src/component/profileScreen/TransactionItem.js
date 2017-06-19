import React from 'react'
import { View, TouchableHighlight, Animated, Text, Image } from 'react-native'
import DefaultText from '../DefaultText'
import Price from '../Price'
import {format} from '../../util/date'
import styles from './ProfileStyle'
import Images from '@Assets/images'
import Colors from '@Colors/colors'
import merge from '../../util/merge'
import animateTo from '../../util/animateTo'
/**
 * Render a row representing a single transaction.
 */

class TransactionItem extends React.Component {
  constructor(props) {
    super(props)

    this.initialState = {
      expanded: false,
      // height: new Animated.Value(),
      spinValue: new Animated.Value(-0.25),
      spin: '-90deg',
      minHeight: styles.list.rowContainer.height,
    }

    this.height = new Animated.Value()

    this.icons = {
      'expand': Images.expandTab
    }

    this.state = this.initialState

    this.updateQueued = false

    this.toggle = this.toggle.bind(this)
    this.resetState = this.resetState.bind(this)
    this.queueUpdate = this.queueUpdate.bind(this)
    this.update = this.update.bind(this)

  }

  resetState() {
    // if(this.state.maxHeight) {
    //   console.log("already has a max height of " + this.state.maxHeight + " so wont refresh")
    //   return
    // }

    this.setState({
      expanded: false,
      // height: new Animated.Value()
    })

    this.height = new Animated.Value()

    // this.queueUpdate()
    // this.state.height.setValue(300)
  }

  queueUpdate() {
    // console.log("state reset and update queued")
    // this.updateQueued = true
    // console.log("updating right away")
    // console.log("max height is " + this.state.maxHeight)
    // console.log("and min height is " + this.state.minHeight)
    this.forceUpdate( () => {
      // this.state.height.setValue(this.state.minHeight)
      // console.log("min height is NOOOOOOOWWWWWW " + this.state.minHeight)
      // console.log("max height is NOOOOOOOWWWWWW " + this.state.maxHeight)
      // console.log("the height itself is NOOOOWWW " + this.height._value)
    })
    // this.state.height.setValue(this.state.minHeight)
    // console.log("max height is " + this.state.maxHeight)


  }

  update() {
    console.log("updated was queued so updating now ")
    this.updateQueued = false
    this.forceUpdate()
  }

  componentWillReceiveProps(nextProps) {
    console.log("receiving new props")
    if (nextProps.transaction.description !== this.props.transaction.description) {
      console.log("and resetting the state! " + nextProps.transaction.description + " vs " + this.props.transaction.description)
      this.resetState()
    }
  }


  componentWillUpdate() {
    // console.log("component will update and height is " + this.height._value + " and max height is " + this.state.maxHeight)
  }

  componentDidUpdate() {
    // console.log("component did update and max height is " + this.state.maxHeight)
    // this.updateQueued && this.update()
    // if (!this.height._value) {
    //   console.log("NO PROPER HEIGHT - RE-RENDER")
      // this.setState({
      //   height: new Animated.Value(this.state.minHeight)
      // })
      // this.height.setValue(this.state.maxHeight)
      // this.toggle()
      // this.forceUpdate()
    // }
    // else {
    //   console.log("valid height of " + this.height._value)
    // }


  }

  componentWillMount() {
    console.log("component mounting")
  }

  _setMinHeight(event) {
    // this.state.height.setValue(this.state.minHeight)
  }

  _setMaxHeight(event) {
    // this.resetState()

    console.log("description on layout triggered with " + event.nativeEvent.layout.height + " for description " + this.props.transaction.description)

    // if(!this.state.maxHeight) {
      console.log("the old max height was " + this.state.maxHeight)
      console.log("setting this height for " + this.props.transaction.relatedAccount.user.display)
      this.setState({
        maxHeight: event.nativeEvent.layout.height,
        // height: new Animated.Value(this.state.minHeight)
      })
      this.height.setValue(this.state.minHeight)

      // console.log("height should now be " + this.height._value)
      // console.log("forcing update")
      // this.update()

    // }
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

    this.height.setValue(initialValue)
    Animated.spring(
      this.height,
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
    const { transaction } = this.props

    const dateString = format(transaction.date, 'Do')

    let icon = this.icons['expand']

    let userEnteredDescription = transaction.description != "Online Payment from Individual Account"

    return (
      <Animated.View style={merge(styles.container, {height: this.height})}>
        <TouchableHighlight
          onPress={() => {userEnteredDescription && this.toggle()}}
          underlayColor={Colors.offWhite}
          key={transaction.transactionNumber}>
          <View style={styles.list.tab.container}>
            <View  style={merge(styles.list.rowContainer, {marginRight: userEnteredDescription ? 0 : 42})}>
              <View style={styles.list.leftColumn}>
                <View style={{flexDirection: 'row', flex: 1}}>
                  <DefaultText style={styles.list.dateNumbers}>{dateString.substring(0, dateString.length - 2)}</DefaultText>
                  <DefaultText style={styles.list.dateLetters}>{dateString.substring(dateString.length - 2, dateString.length)}</DefaultText>
                </View>
                <DefaultText style={styles.list.day}>{format(transaction.date, 'dddd')}</DefaultText>
              </View>
              <View style={styles.list.midColumnOuter}>
                <View style={styles.list.midColumnInner}>
                  <DefaultText style={styles.list.timeText}>{format(transaction.date, 'HH:mm:ss')}</DefaultText>
                  <DefaultText style={styles.list.idText}>{transaction.transactionNumber}</DefaultText>
                </View>
              </View>
              <Price
                style={styles.list.price}
                size={27}
                price={transaction.amount}/>
              {userEnteredDescription &&
              <View>
                <View
                  style={styles.list.button}
                  underlayColor={Colors.transparent}>
                  <Animated.Image
                    style={merge(styles.list.buttonImage, {transform: [{rotate: this.state.spin}]})}
                    source={icon}
                  ></Animated.Image>
                </View>
              </View>}
            </View>
            {userEnteredDescription &&
            <View style={styles.list.description.container} onLayout={this._setMaxHeight.bind(this)}>
              <DefaultText style={merge(styles.list.description.text, {fontSize: 20})}>
                Description:
              </DefaultText>
              <Text style={styles.list.description.text}>
                { transaction.description }
              </Text>
            </View>}
          </View>
        </TouchableHighlight>

      </Animated.View>
    )

  }

}


export default TransactionItem
