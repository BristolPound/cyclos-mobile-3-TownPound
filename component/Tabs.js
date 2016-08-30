import React from 'react'
import { ScrollView, View, StatusBar, Modal, Image } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import Business from './Business'
import TransactionsList from './TransactionsList'
import SendMoney from './SendMoney'
import color from '../util/colors'
import { connect } from 'react-redux'
import { navigateToTab, showSendMoney } from '../store/reducer/navigation'

// https://icons8.com/web-app/for/ios7/money
// https://www.base64-image.de
const shopsIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAB0tJREFUeAHtXFvIVFUU9s/+tP4sLXuQSDSTirSrWVQ0UyFU9FKBD0EP0YWoECLoAj34ElERvvaYFBRdkKCgiHJ+pbsUSQqS4fBLdsE07X6x+j49G9esxplzmdmz9j57weKcNWftvb9vrbP3Ppd9Ztq0JCkCKQIpAikCKQLlIjCWFZuP7T3QO6AnZ78V2fwO5x3Q7dCvoFugr0B/hCYpGIEz4P8T9N8B637U9wh0JjRJgQi8BN9BJ0PW9wnqn1UAT+1d9w05IUzOa1A3PNY+4P0C0CshPJZHZsBpMXQF9FHod1DZS7i/CpokRwReho8OnrN5rIzMRqFNUFcPtz9D50GT9InA6TjebVLnbzxWVrrVu6ZsZXUrx8veh6CbM+U+f6sqD6IC2Uv2wB6vWmkqXz4CEyiq56grylcXf8mjhkzxF9T/pmrjEmUnU0Rg2AlhU+tFe9xtKjuZniNwFtqT8wgfp/g4ETzTDKu5b1VSLgoLvj+0vs7UDYpSQ9nJzCLgKyEtFfGmspPpOQLnoD05j+yF7etk8Ew1jOb4YPF7qEzKhWFA94vS11nKRKR5JEdufSWEUFoKT1PZyfQcgaVoTw5ZaR7xnADdHOeR3SopF2inuts+h6xu80iz7gnQ/H0mhG1PKgANZSfTcwTOQ3tyHuH7Ed8nhWfKtpvjPMIkyKScbxuyX3S+z840j/jNb67W7oeX7CF13Z9CHC7NFbEhO/FSt65J0LyZlI5RqsMYciJc9Z9jJ635PRSN/y2zHUVC/gGWjS47Nd++AP6Mx8jlASCQ3XfdyBENH8ApaOJPxdvMFeYyBewH2Lwkjln0xcxnlshOB5h9UNlLzrUEcAhYuAhR8l01hDYqVfmGdYCV2HUW5qIOmYw/YM/tdDlkjWJSdzhabifbNpQdk3mbIvM6bD75NiXLgUaeNQQY4zzCTzU4R0quN8A2J0cDET97k0CXmENZHdBKxfEb2JxDu8ooh6y/geg9haqp7BhMPVw9B1IHrBLjZw+yh5T9QMgqv1MBjCee5Hi2VbDExYdrEiyXCsU0jzys+H0I27RwHuGnbjIpXFQXi2wDEcnt7hCIvaVA8w8MYpDLQEIm4zfYJ/YjNspJ3WGbdDvZtqnsUE09mfN5HZ9OmBd9JvHThdDlOBDQl/T8ZDwI4Ueg/PRNdm/TVyI5onqr4jMFO9dolMspB4AqLn+h8PuqgoayQzP1cLUWBEy898gbSP77g+whL+YtaNBvITAx+JLPIoM4e0Lip9KSAB8vhCqrAVxy2RAikWMA+ldF5MwAiYwB8w7FQw9fwdB6VxG5Kxjkh4FerTjwpvf4w4f771mY1B3KltvJtk1lh2Dq3sBnc0xKkNIAajn2fh0YixOAV1++XxkYhw64fJHDxwsyKYs7PGwbdyrs22FzTikkloYsvmf+SKFnrwlF9HC1FsB5cgUtq4Fe9pDnA2HDK0KJmy+g5geCvSfMqxSxnT297Rx8XOF+2w60akhmojiHLnm2Wb/LnQ68vACRmG+BHY3wzlaSu904s+sUXi4kP7YsZkuTuuMw6XaybUPZ1kw9mfM5HK8Wo5FrwET2kCnDzE4CNj3EmvgIZ5Ax48sdvUp84SAbGGBd96EuefJsrVq3xSGLDxk/VsSayrZi6uHqWSvABo3jMVQozzyLRLlaX2Lk+qt50ChlBVhJsm2DLNcojFxAHa1MgJmeR2SCLO7fHG02MmIfYGsx8N0w7QZWvmSrLBYndUeq5XYC2PK9B3t01HIt2HU7Gy39xivCJ6G8H4le+OqTS4RcAriSI3rilocsvvr8FOpkDDsNZ8S6tZwQxrylAt9UdjI9R+B6tOeGLG43e24/NaciwIUDvAN2SeE8Mlf5RGVaH7L2I9ryHw84j1weVQYUGesJIdyNCnPUCVFcTZorgcoNWdxuM4myRqDmgKt+rtWsEX+TVPloQvaS9SZR1gjUxSohTM69MfLnEpYQZBdA8jO3JQIs71GWQ7l0iF+3Mkm8u+c2iYcI8G2c/hMXBt+KtoGFPblWwhUde6BWkqBxtIEthFsJwBycnIaqXoXqYFiw+Th+vArVUOYQyZF37wugfO9uTZgMrtPSN7PWcA4UD3uI/o6kjd+44HlpptxvQ2Wv4buVRdC8Ql/5PoZ1taH92mFCFkBrI0+BqQz0l7AnurDnbzwmfZ/u4nekn+gryxZphytSaiNbwVQG6qYezHlM+m7p4asP0VeWLdJOrR7vcEiQgZqlIylsHpO+RRZB62GxSDulFzyEeIlW5UKkyBVQEV9xDhzcLR3X0gU1Ao/2TtVWr6stfUyXVVV1mNpX1yWd9TFdVvpGt/8MGMlhqMhky7J5xVc7efGY9eMzLflal8lpQ/tdjrIMy+YVX+3kxWPa7wmgk70kzz7LFBVf7RTFZc5/HIjegeZJBH3oyzJFxVc7RXGZ9J8BVFzGeQB6pMTwGH3oW1Z8tXMQH1dxhC58R3IjdFmm5LMp03XYfsEfBiBe2vkP5gcUl912/34AAAAASUVORK5CYII='
const transactionsIcon = 'data:image/png;base64,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'
const sendMoneyIcon = 'data:image/png;base64,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'

const statusBarHeight = 20

const Tabs = (props) =>
  <View style={{backgroundColor: color.bristolBlue, flex: 1}}>
    <StatusBar barStyle='light-content'/>
    <ScrollableTabView
      tabBarPosition='bottom'
      tabBarActiveTextColor={color.bristolBlue}
      style={{marginTop: 20, flex: 1, backgroundColor: 'white'}}
      tabBarBackgroundColor='#eee'
      scrollWithoutAnimation={true}
      locked={true}
      tabBarUnderlineColor='rgba(0, 0, 0, 0)'>
      <ScrollView contentContainerStyle={{flex:1}}
          tabLabel='Directory'>
        <Business businesses={props.businesses}/>
      </ScrollView>
      <ScrollView
          tabLabel='Transactions'>
        <TransactionsList/>
      </ScrollView>
      <ScrollView
          tabLabel='Send Money'>
        <SendMoney cancel={() => props.showSendMoney(false)}/>
      </ScrollView>
    </ScrollableTabView>
  </View>

const mapDispatchToProps = (dispatch) => ({
  navigateToTab: (tabName) => {
    dispatch(navigateToTab(tabName))
  },
  showSendMoney: (visible) => {
    dispatch(showSendMoney(visible))
  }
})

const mapStateToProps = (state) => ({...state.navigation})

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
