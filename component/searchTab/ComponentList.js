import React from 'react'
import { View } from 'react-native'

class ComponentList extends React.Component {
  constructor() {
    super()
    this.layoutInfo = []
    this.state = {
      highlightedIndex: -1
    }
  }

  captureChildLayout(event, index) {
    const {x, y, width, height} = event.nativeEvent.layout
    this.layoutInfo[index] = {
      index, x, y, width, height, pressable: this.props.items[index].pressable
    }
  }

  highlightItem(location) {
    const hit = this.layoutInfo.find(f => f.y < location && (f.y + f.height) > location)
    this.setState({
      highlightedIndex: hit && hit.pressable ? hit.index : -1
    })
  }

  handleRelease(hasMoved) {
    const index = this.state.highlightedIndex
    if (!hasMoved && this.props.items[index]) {
      this.props.onPressItem(this.state.highlightedIndex)
    }
    this.setState({
      highlightedIndex: -1
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.props.items.map((item, index) => {
          let containerBackgroundColor
          if (item.pressable) {
            containerBackgroundColor = this.state.highlightedIndex === index
              ? 'lightsteelblue'
              : 'white'
          }
          return (
            <View style={{ backgroundColor: containerBackgroundColor }}
                onLayout={(event) => this.captureChildLayout(event, index)}
                key={item.id || index}>
              {this.props.componentForItem(item)}
            </View>
          )
        })}
      </View>
    )
  }
}

export default ComponentList