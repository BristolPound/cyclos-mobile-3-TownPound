import React from 'react'
import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import _ from 'lodash'
import haversine from 'haversine'

import DefaultText from '../DefaultText'
import BusinessListItem from './BusinessListItem'
import { CloseButton } from '../common/CloseButton'
import ScrollingExpandPanel from './ScrollingExpandPanel'
import ComponentList from './ComponentList'

import colors from '../../util/colors'
import { addColorCodes } from '../../util/business'
import searchTabStyle, { maxExpandedHeight, SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN } from './SearchTabStyle'
import { ROW_HEIGHT } from './BusinessListStyle'

const { searchBar, textInput, searchHeaderText, closeButton, expandPanel, nearbyButton } = searchTabStyle.searchTab

const CLOSE_BUTTON = require('../common/assets/Close.png')
const NEARBY_BLUE = require('./assets/nearby_blue.png')
const NEARBY_GREY = require('./assets/nearby_grey.png')

const MAX_LIST_LENGTH = 50

const ComponentForItem = (item) => {
  if (typeof item === 'string') {
    return  <DefaultText style={searchHeaderText}>
                { item }
            </DefaultText>
  }
  return <BusinessListItem business={item}/>
}

export default class Search extends React.Component {
    constructor(props) {
      super(props)
      this.state = { searchTerms: [], componentListArray: [], input: null }
    }

    debouncedUpdate = _.debounce(() => {
      const { allBusinesses } = this.props
      const termsMatch = (field) => {
        let match = true
        this.state.searchTerms.forEach((term) => {
          if (match && field.toLowerCase().indexOf(term.toLowerCase()) === -1) {
            match = false
          }
        })
        return match
      }
      this.refs.ExpandPanel && this.refs.ExpandPanel.resetToInitalState()
      const filteredBusinessList = allBusinesses.filter(business => termsMatch(business.display) || termsMatch(business.shortDisplay))
      const componentListArray = this.createComponentListArray(addColorCodes(filteredBusinessList))
      this.setState({ componentListArray })
    }, 800)

    _onChangeText(input) {
      this.setState({ searchTerms: input.split(' '), input: input || null })
      this.debouncedUpdate()
    }

    _businessListOnClick(id) {
      this.refs.textInput.blur()
      this.props.openTraderModal(id)
    }

    closeSearchScreen() {
      this.props.updateSearchMode(false)
      this.refs.textInput.blur()
      this.setState({ searchTerms: [], input: null })
    }

    nearbyButtonEnabled() {
      return this.props.geolocationStatus && haversine(this.props.geolocationStatus, this.props.mapViewport) > 0.1 //km
    }

    nearbyButtonPressed() {
      this.props.updateMapViewport(this.props.geolocationStatus)
      this.props.moveMap()
    }

    createComponentListArray(list) {
      const cropped = list.length > MAX_LIST_LENGTH
      const matches = list.length
      if (cropped) {
        list.length = MAX_LIST_LENGTH
      }
      const makePressable = (itemProps) => ({...itemProps, pressable: true})
      const array = [ `${matches} TRADER MATCHES`, ...list.map(makePressable) ]
      if (cropped) {
        array.push(`${matches - MAX_LIST_LENGTH} ADDITIONAL RESULTS NOT DISPLAYED`)
      }
      return array
    }

    render() {
      const { componentListArray, input } = this.state
      const { searchMode, updateSearchMode } = this.props

      const childrenHeight = componentListArray.length * ROW_HEIGHT

      const { componentList } = this.refs

      return (
        <View>
          <View style={searchBar}>
            <TouchableOpacity style={nearbyButton}
                onPress={this.nearbyButtonEnabled() ? () => this.nearbyButtonPressed() : undefined}>
              <Image source={this.nearbyButtonEnabled() ? NEARBY_BLUE : NEARBY_GREY}/>
            </TouchableOpacity>
            <TextInput accessibilityLabel='Search'
                       ref='textInput'
                       onFocus={() => !searchMode && updateSearchMode(true)}
                       onChangeText={(text) => this._onChangeText(text)}
                       placeholder={'Search Trader'}
                       placeholderTextColor={colors.gray4}
                       selectTextOnFocus={true}
                       style={textInput}
                       value={input}
                       underlineColorAndroid={colors.transparent}/>
            { searchMode &&
                <CloseButton onPress={() => this.closeSearchScreen()} closeButtonType={CLOSE_BUTTON} style={closeButton} size={SEARCH_BAR_HEIGHT}/> }
          </View>
          { searchMode && (
                  <ScrollingExpandPanel style={expandPanel}
                                        ref='ExpandPanel'
                                        topOffset={[ SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN ]}
                                        expandedHeight={maxExpandedHeight}
                                        childrenHeight={childrenHeight}
                                        startPosition={0}
                                        onPressRelease={hasMoved => componentList && componentList.handleRelease(hasMoved)}
                                        onPressStart={location => componentList && componentList.highlightItem(location)}>
                      <ComponentList
                          ref='componentList'
                          items={componentListArray}
                          componentForItem={ComponentForItem}
                          onPressItem={index => componentListArray[index].id && this._businessListOnClick(componentListArray[index].id)} />
                  </ScrollingExpandPanel>
          )}
        </View>
      )
    }
}
