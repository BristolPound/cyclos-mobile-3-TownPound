import React from 'react'
import { TouchableHighlight, View } from 'react-native'
import DefaultText from './DefaultText'
import { switchBaseUrl } from '../api'

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    backgroundColor: 'orange'
  },
  text: {
    color: 'white'
  }
}

class SwitchServerButton extends React.Component {
  constructor() {
      super()
      this.state = {usingProdServer: true}
  }

  render() {
    return (
      <TouchableHighlight style={styles.container} onPress={() => { this.setState({usingProdServer: !this.state.usingProdServer}); switchBaseUrl() }}>
        <View>
          <DefaultText style={styles.text}>
            {'Server: ' + (this.state.usingProdServer ? 'Prod' : 'Dev')}
          </DefaultText>
        </View>
      </TouchableHighlight>
    )
  }
}

export default SwitchServerButton
