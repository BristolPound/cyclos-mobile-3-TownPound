import React from 'react'
import { View, TextInput, TouchableHighlight } from 'react-native'
import _ from 'lodash'

import DefaultText from '../DefaultText'
import BusinessListItem from './BusinessListItem'
import { CloseButton } from '../common/CloseButton'
import ScrollingExpandPanel from './ScrollingExpandPanel'
import ComponentList from './ComponentList'

import colors from '../../util/colors'
import merge from '../../util/merge'
import searchTabStyle, { maxExpandedHeight, SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN } from './SearchTabStyle'
import { ROW_HEIGHT } from './BusinessListStyle'

const { searchBar, textInput, searchHeaderText, closeButton, clearTextButton, clearText, expandPanel } = searchTabStyle.searchTab

const CLOSE_BUTTON = require('./../common/assets/Close.png')

const ComponentForItem = (item) => {
  if (typeof item === 'number') {
    return  <DefaultText style={searchHeaderText}>
                { item } TRADER MATCHES
            </DefaultText>
  }
  return <BusinessListItem business={item}/>
}

export default class Search extends React.Component {
    constructor(props) {
        super(props)
        this.resetState = this.resetState.bind(this)
        this.state = { searchTerm: null, componentListArray: [] }
    }

    debouncedUpdate = _.debounce((searchTerm) => {
      const { businessList } = this.props
      this.refs.ExpandPanel && this.refs.ExpandPanel.resetToInitalState()
      if (searchTerm.length >= 3) {
        const filteredBusinessList = businessList.filter(business =>
                    business.display.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
        const componentListArray = this.createComponentListArray(filteredBusinessList)
        this.setState({ componentListArray })
      } else {
        this.setState({ componentListArray: [] })
      }
    }, 300)

    _onTextChange(searchTerm) {
        this.setState({ searchTerm: searchTerm || null })
        this.debouncedUpdate(searchTerm)
    }

    _closeButtonClick() {
      if (!this.updating) {
        this.props.updateSearchMode(false)
        this.refs.searchBar.blur()
        this.resetState()
      }
    }

    _businessListOnClick(id) {
        this.refs.searchBar.blur()
        this.props.openTraderModal(id)
    }

    _clearText() {
        this.refs.searchBar.focus()
        this.resetState()
    }

    resetState() {
      if (!this.updating) {
        this.updating = true
        this.setState({ searchTerm: null })
        this.updating = false
      }
    }

    createComponentListArray(list) {
      const makePressable = (itemProps) => ({...itemProps, pressable: true})
      return [ list.length, ...list.map(makePressable) ]
    }

    render() {
        const { searchTerm, componentListArray } = this.state
        const { searchMode, openTraderModal, updateSearchMode } = this.props

        const childrenHeight = componentListArray.length * ROW_HEIGHT

        const { componentList } = this.refs

        return (
            <View>
                <View style={searchBar}>
                    <TextInput accessibilityLabel='Search'
                               ref='searchBar'
                               onFocus={() => !searchMode && updateSearchMode(true)}
                               onChangeText={value => this._onTextChange(value)}
                               placeholder={'Search Trader'}
                               placeholderTextColor={colors.gray4}
                               selectTextOnFocus={true}
                               style={merge(textInput, { color: searchTerm && searchTerm.length >= 3 ? colors.bristolBlue : colors.gray4 })}
                               value={searchTerm} />
                    { searchMode && searchTerm &&
                        <TouchableHighlight style={clearTextButton} onPress={() => this._clearText()}>
                            <DefaultText style={clearText}>x</DefaultText>
                        </TouchableHighlight> }
                    { searchMode &&
                        <CloseButton onPress={() => this._closeButtonClick()} closeButtonType={CLOSE_BUTTON} style={closeButton} size={SEARCH_BAR_HEIGHT}/> }
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
                                onPressItem={index => componentListArray[index].id && openTraderModal(componentListArray[index].id)} />
                        </ScrollingExpandPanel>
                )}
            </View>
        )
    }
}
