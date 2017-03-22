import React from 'react'
import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import _ from 'lodash'
import haversine from 'haversine'

import DefaultText from '../DefaultText'
import BusinessListItem from './BusinessListItem'
import { Button } from '../common/Button'
import DraggableList from './DraggableList'
import ComponentList from './ComponentList'
import ProfileImage from '../profileImage/ProfileImage'
import { isScreenSmall } from '../../util/ScreenSizes'

import { tabModes, allFilters } from '../../store/reducer/business'
import styles from './BusinessListStyle'

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

const ComponentForItem = (item) => {
  if (typeof item === 'string') {
    return  <DefaultText style={searchHeaderText}>
                { item }
            </DefaultText>
  }
   return (
    <View style={container} ref="filterListItem">
          <View style={status}/>
          <View style={contents}>
              <ProfileImage image={images[item.label]} style={styles.listItem.image} category={'shop'} borderColor='offWhite'/>
              <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, marginRight: 10 }}>
                  <DefaultText style={{ fontSize: isScreenSmall ? 16 : 18}}>{item.text}</DefaultText>
                  {<DefaultText style={{ fontSize: isScreenSmall ? 16 : 18}}>a</DefaultText>}
              </View>
          </View>
      </View>
    )
}

export default class FiltersComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = { componentListArray: this.createComponentListArray(allFilters) }
    }

    updateResults = () => {
      this.refs.FilterPanel && this.refs.FilterPanel.resetToInitalState()
      const componentListArray = this.createComponentListArray(allFilters)
      this.setState({ componentListArray })
    }

    debouncedUpdate = _.debounce(() => this.updateResults(), 800)

    _filtersListOnClick(id) {
    }

    createComponentListArray(list) {
      const makePressable = (itemProps) => {
        itemProps.pressable = true
        return itemProps
      }
      return [ `FILTERED BY `, ...list.map(makePressable) ]
    }

    render() {
      const { componentListArray } = this.state
      const { activeFilters } = this.props

      const childrenHeight = componentListArray.length * ROW_HEIGHT

      const { componentList } = this.refs

      return (
          <DraggableList style={expandPanel}
            ref='FilterPanel'
            topOffset={[ SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN ]}
            expandedHeight={maxExpandedHeight}
            childrenHeight={childrenHeight}
            startPosition={0}
            onTouchEnd={hasMoved => componentList && componentList.handleRelease(hasMoved)}
            onTouchStart={location => componentList && componentList.highlightItem(location)}>
              <ComponentList
                  ref='componentList'
                  items={componentListArray}
                  componentForItem={ComponentForItem}
                  onPressItem={index => componentListArray[index] && this._filtersListOnClick(componentListArray[index].label)} />
          </DraggableList>
      )
    }
}
