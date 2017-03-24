import React from 'react'
import { View, TextInput, TouchableHighlight, Image, ScrollView, Platform } from 'react-native'
import _ from 'lodash'
import haversine from 'haversine'

import DefaultText from '../DefaultText'
import BusinessListItem from './BusinessListItem'
import { Button } from '../common/Button'
import DraggableList from './DraggableList'
import ComponentList from './ComponentList'
import ProfileImage from '../profileImage/ProfileImage'
import { isScreenSmall } from '../../util/ScreenSizes'
import merge from '../../util/merge'

import { tabModes, allFilters } from '../../store/reducer/business'
import styles from './BusinessListStyle'
import { dimensions, margin } from '../../util/StyleUtils'
import colors from '../../util/colors'
import { addColorCodes, getBusinessName } from '../../util/business'
import searchTabStyle, { maxExpandedHeight, SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN } from './SearchTabStyle'
import { ROW_HEIGHT } from './BusinessListStyle'

const foodanddrink = require('./assets/foodanddrink.png')
const goingout = require('./assets/goingout.png')
const visitingbristol = require('./assets/visitingbristol.png')
const shopping = require('./assets/shopping.png')
const foryourbusiness = require('./assets/foryourbusiness.png')
const foryourhome = require('./assets/foryourhome.png')
const gettingaround = require('./assets/gettingaround.png')
const lookingafteryou = require('./assets/lookingafteryou.png')

const TICK = require('./assets/Tick.png')

const images = {
  foodanddrink,
  goingout,
  visitingbristol,
  shopping,
  foryourbusiness,
  foryourhome,
  gettingaround,
  lookingafteryou
}

const { searchHeaderText, closeButton, expandPanel, nearbyButton } = searchTabStyle.searchTab

const { container, contents, status } = styles.listItem

const ComponentForItem = (item, onPress) => {
  if (typeof item === 'string') {
    return  <DefaultText style={searchHeaderText}>
                { item }
            </DefaultText>
  }
   return (
    <TouchableHighlight style={container} ref="filterListItem" onPress={onPress} underlayColor={colors.offWhite}>
          <View style={contents}>
              <ProfileImage image={images[item.label]} style={styles.listItem.image} category={'shop'} borderColor='offWhite'/>
              <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, marginRight: 10 }}>
                  <DefaultText style={{ fontSize: isScreenSmall ? 16 : 18}}>{item.text}</DefaultText>
                  {item.filterActive && <Image style={merge(...dimensions(18), margin((24 - 18) / 2))} source={TICK} />}
              </View>
          </View>
    </TouchableHighlight>)
}

export default class FiltersComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = { componentListArray: this.createComponentListArray(allFilters) }
    }

    componentWillReceiveProps(nextProps) {
      this.refs.FilterPanel && this.refs.FilterPanel.resetToInitalState()
      const componentListArray = this.createComponentListArray(allFilters)
      this.setState({ componentListArray })
    }

    _filtersListOnClick(filter) {
      if (filter.filterActive) {
        this.props.removeFilter(filter.label)
      } else {
        this.props.addFilter(filter.label)
      }
    }

    createComponentListArray(list) {
      const setFilterState = (itemProps) => {
        itemProps.pressable = true
        itemProps.filterActive = this.props.activeFilters.includes(itemProps.label)
        return itemProps
      }
      return [ `FILTERED BY `, ...list.map(setFilterState) ]
    }

    render() {
      const { componentListArray } = this.state
      const { activeFilters } = this.props

      const childrenHeight = componentListArray.length * ROW_HEIGHT

      const { componentList } = this.refs

      return (
          <ScrollView
            style={{
              top: SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN,
              overflow: 'hidden',
              position: 'absolute',
              // zIndex is needed for overflow: hidden on android, but breaks shadow on iOS
              zIndex: Platform.OS === 'ios' ? undefined : 100,
              ...expandPanel}} >
              {componentListArray.map((item, index) => {
                let containerBackgroundColor = item.pressable ? 'white' : 'transparent'
                return (
                  //zIndex is required for overflow to work on android
                  <View style={{ backgroundColor: containerBackgroundColor, overflow: 'hidden', zIndex: 100 }}
                      key={item.id || index}>
                    {ComponentForItem(item, () => this._filtersListOnClick(item))}
                  </View>
                )
              }

              )}
          </ScrollView>
      )
    }
}
