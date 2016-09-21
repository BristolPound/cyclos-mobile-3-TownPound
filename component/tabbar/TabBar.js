import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'
import DefaultText from '../DefaultText'
import Price from '../Price'
import { connect } from 'react-redux'
import color from '../../util/colors'

const TAB_BAR_HEIGHT = 45
const BASELINE = 9
// react native doesn't support adjusting text baseline, so we have to use a magic number
// in order to align the amount with the icons
const MAGIC_NUMBER = 6

const style = {
  tabBar: {
    height: TAB_BAR_HEIGHT,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -2
    },
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  separator: {
    height: TAB_BAR_HEIGHT / 2,
    width: 1,
    backgroundColor: '#e2e3e6'
  },
  amountContainer: {
    width: 142,
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  amountInnerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 10,
    height: TAB_BAR_HEIGHT
  },
  loginText: {
    color: color.bristolBlue
  },
  centerChildren: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    height: TAB_BAR_HEIGHT,
    flex: 1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'flex-end',
    paddingBottom: BASELINE
  },
  balanceSymbol: {
    paddingRight: 4,
    marginBottom: BASELINE
  },
  amount: {
    marginBottom: BASELINE - MAGIC_NUMBER
  }
}

// NOTE - The image URLs must be known statically
// see: https://facebook.github.io/react-native/docs/images.html
const TABS = [
  {
    active: require('./Search_active.png'),
    inactive: require('./Search_inactive.png')
  },
  {
    active: require('./Spending_active.png'),
    inactive: require('./Spending_inactive.png')
  },
  {
    active: require('./Me_active.png'),
    inactive: require('./Me_inactive.png')
  }
]

const TabBar = (props) =>
  <View style={style.tabBar}>
    {TABS.map((tab, index) =>
      <View style={style.centerChildren} key={index}>
        <TouchableHighlight
            style={style.iconContainer}
            onPress={() => props.goToPage(index)}
            underlayColor={color.transparent}>
          <Image source={props.activeTab === index ? tab.active : tab.inactive}/>
        </TouchableHighlight>
        {index !== TABS.length - 1 ? <View style={style.separator}/> : undefined}
      </View>
    )}
    <View style={style.amountContainer}>
      {
        props.loggedIn
          ? <View style={style.amountInnerContainer}>
              <Image source={require('./balance_symbol.png')} style={style.balanceSymbol}/>
              <Price
                  style={style.amount}
                  price={props.balance}
                  prefix=''
                  size={30}
                  color={color.bristolBlue}/>
            </View>
          : <TouchableHighlight
                style={style.centerChildren}
                onPress={() => props.goToPage(1)}
                underlayColor={color.transparent}>
              <View>
                <DefaultText style={style.loginText}>Login</DefaultText>
              </View>
            </TouchableHighlight>
      }
    </View>
  </View>



const mapStateToProps = (state) => ({
  loggedIn: state.login.loggedIn,
  balance: state.account.balance
})

export default connect(mapStateToProps)(TabBar)
