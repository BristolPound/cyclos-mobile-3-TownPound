import React from 'react'
import { View, TextInput, TouchableHighlight } from 'react-native'

import DefaultText from '../DefaultText'
import BusinessListHighlight from './BusinessListHighlight'
import { CloseButton } from '../common/CloseButton'
import { margin } from '../../util/StyleUtils'

import colors from '../../util/colors'
import searchTabStyle from './SearchTabStyle'
import ScrollingExpandPanel from './ScrollingExpandPanel'

const CLOSE_BUTTON = require('./../common/Close_Blue.png')

export default class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = { searchTerm: null, filteredBusinessList: [] }
    }

    _onTextChange(searchTerm) {
        const { businessList } = this.props
        const filteredBusinessList = businessList.filter(business => business.display.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
        this.setState({ searchTerm, filteredBusinessList })
    }

    _toggleSearchMode () {
        const { searchMode, updateSearchMode } = this.props
        updateSearchMode(!searchMode)
    }

    _textInputFocus() {
        if (this.state.searchTerm === null) {
            this._toggleSearchMode()
        }
    }

    _closeButtonClick() {
        this._toggleSearchMode()
        this.refs.searchBar.blur()
        this.setState({ searchTerm: null, filteredBusinessList: [] })
    }

    _businessListOnClick(id) {
        this.props.openTraderModal(id)
    }

    render() {
        const { filteredBusinessList, searchTerm } = this.state
        const { searchMode } = this.props
        const { list, searchBar, textInput, searchHeaderText } = searchTabStyle.searchTab

        return (
            <View>
                <View style={searchBar}>
                    <TextInput accessibilityLabel={'Search'}
                               ref="searchBar"
                               onFocus={() => this._textInputFocus()}
                               onChangeText={value => this._onTextChange(value)}
                               placeholder={'Search Trader'}
                               placeholderTextColor={colors.gray4}
                               selectTextOnFocus={true}
                               style={textInput}
                               value={searchTerm} />
                    { searchMode &&
                        <CloseButton onPress={() => this._closeButtonClick()} closeButtonType={CLOSE_BUTTON} style={{...margin(3,0,0,0), right: 0}} /> }
                </View>
                { searchMode && (
                    <View style={list}>
                        <ScrollingExpandPanel topOffset={[0]}
                                              expandedHeight={50}
                                              childrenHeight={1000}
                                              startPosition={0}>
                            <DefaultText style={searchHeaderText}>
                                { filteredBusinessList && filteredBusinessList.length } TRADER MATCHES
                            </DefaultText>
                            { filteredBusinessList &&
                                filteredBusinessList.map(business => <BusinessListHighlight key={business.id} business={business} onPress={id => this._businessListOnClick(id)}/>)
                            }
                        </ScrollingExpandPanel>
                     </View>
                )}
            </View>
        )
    }
}