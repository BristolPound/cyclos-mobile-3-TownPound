import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { bindActionCreators } from 'redux'
import DefaultText from '../DefaultText'
import Price from '../Price'
import { connect } from 'react-redux'
import color from '../../util/colors'
import { openLoginForm } from '../../store/reducer/login'
import { showModal, modalState } from '../../store/reducer/navigation'
import { LOGIN_STATUSES } from '../../store/reducer/login'
import style from './TabBarStyle'
import Config from 'react-native-config'

// NOTE - The image URLs must be known statically
// see: https://facebook.github.io/react-native/docs/images.html

const TabItem = (active, inactive, label) => ({ active, inactive, label })
const TABS = [
    TabItem(
        require('./assets/Search_active.png'),
        require('./assets/Search_inactive.png'),
        'Search Tab'
    ),
    TabItem(
        require('./assets/Spending_active.png'),
        require('./assets/Spending_inactive.png'),
        'Spending Tab'
    ),
    TabItem(
        require('./assets/Me_active.png'),
        require('./assets/Me_inactive.png'),
        'My Details Tab'
    )
]

const isDevMode = Config.FLAVOUR === 'dev'

const TabBar = (props) => 
  <View style={style.tabBar}>
    {TABS.map((tab, index) =>
      <View style={style.centerChildren} key={index}>
        <TouchableOpacity
            style={style.iconContainer}
            onPress={() => props.goToPage(index)}
            onLongPress={() => {isDevMode && props.showModal(modalState.developerOptions)}}
            accessibilityLabel={tab.label}>
          <Image source={props.tabIndex === index ? tab.active : tab.inactive}/>
        </TouchableOpacity>
        {index !== TABS.length - 1 ? <View style={style.separator}/> : undefined}
      </View>
    )}
    <View style={style.amountContainer}>
      {
        props.loggedIn
          ? <View style={style.amountInnerContainer}>
              <Image source={require('./assets/balance_symbol.png')} style={style.balanceSymbol}/>
              <Price
                  style={style.amount}
                  price={props.balance}
                  prefix=''
                  size={30}
                  color={color.bristolBlue}/>
            </View>
          : <TouchableOpacity
                style={style.centerChildren}
                onPress={props.connection ? () => props.openLoginForm(true) : undefined}
                accessibilityLabel='Log in Tab'>
              <View>
                <DefaultText style={{ color: props.connection ? color.bristolBlue : color.offWhite }}>Log in</DefaultText>
              </View>
            </TouchableOpacity>
      }
    </View>
  </View>


const mapStateToProps = (state) => ({
  loggedIn: state.login.loginStatus === LOGIN_STATUSES.LOGGED_IN,
  balance: state.account.balance,
  connection: state.networkConnection.status,
  tabIndex: state.navigation.tabIndex
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    openLoginForm,
    showModal
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TabBar)
