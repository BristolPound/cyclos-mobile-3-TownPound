import React from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import ComponentList from './ComponentList'
import BusinessListItem, { SelectedBusiness } from './BusinessListItem'
import ScrollingExpandPanel from './ScrollingExpandPanel'
import styles, {SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN_TOP_IOS, SEARCH_BAR_MARGIN, MAP_HEIGHT} from './SearchTabStyle'
import {ROW_HEIGHT} from './BusinessListStyle'
import {TAB_BAR_HEIGHT} from '../tabbar/TabBar'
import { openTraderModal } from '../../store/reducer/navigation'
import {BUSINESS_LIST_SELECTED_GAP} from './BusinessListStyle'

const BUSINESS_LIST_GAP_PLACEHOLDER = { pressable: false }

const SHORT_LIST_BOTTOM_GAP = 12
const EXPANDED_LIST_TOP_OFFSET = SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN

// Here we use SEARCH_BAR_MARGIN_TOP_IOS because
// Dimensions.get('window').height includes the status bar, even on android
const maxExpandedHeight = Dimensions.get('window').height - SEARCH_BAR_MARGIN_TOP_IOS - SEARCH_BAR_HEIGHT - TAB_BAR_HEIGHT
const maxCollapsedHeight = maxExpandedHeight - MAP_HEIGHT

const calculatePanelHeight = (rowCount, selectedBusiness) => {
  const selectedBusinessModifier = selectedBusiness ? BUSINESS_LIST_SELECTED_GAP + ROW_HEIGHT : 0
  const collapsedHeight = Math.min(
    rowCount * ROW_HEIGHT + selectedBusinessModifier + SHORT_LIST_BOTTOM_GAP,
    maxCollapsedHeight
  )
  const expandedHeight = Math.max(
    Math.min(rowCount * ROW_HEIGHT + selectedBusinessModifier, maxExpandedHeight),
    collapsedHeight
  )
  return ({ collapsedHeight, expandedHeight })
}

class SearchTab extends React.Component {
  createComponentArray() {
    const makePressable = (itemProps) => ({...itemProps, pressable: true})
    if (this.props.selectedBusiness) {
      return [
        { ...makePressable(this.props.selectedBusiness), isSelected: true },
        BUSINESS_LIST_GAP_PLACEHOLDER,
        ...this.props.closestBusinesses.map(makePressable)
      ]
    } else {
      return this.props.closestBusinesses.map(makePressable)
    }
  }

  render() {
    const { collapsedHeight, expandedHeight } = calculatePanelHeight(
      this.props.closestBusinesses.length,
      this.props.selectedBusiness
    )
    const componentArray = this.createComponentArray()
    return (
      <View style={{flex: 1}}>
        <BackgroundMap/>
      <View style={styles.searchTab.searchBar}/>
        <ScrollingExpandPanel
          style={styles.searchTab.expandPanel}
          topOffsetWhenExpanded={EXPANDED_LIST_TOP_OFFSET + maxExpandedHeight - expandedHeight}
          topOffsetWhenCollapsed={EXPANDED_LIST_TOP_OFFSET + maxExpandedHeight - collapsedHeight}
          expandedHeight={expandedHeight}
          onPressRelease={(hasMoved) => this.refs.componentList.handleRelease(hasMoved)}
          onPressStart={(location) => this.refs.componentList.highlightItem(location)}
          childrenHeight={this.props.selectedBusiness
            ? this.props.closestBusinesses.length * ROW_HEIGHT + BUSINESS_LIST_SELECTED_GAP
            : this.props.closestBusinesses.length * ROW_HEIGHT}>
          <ComponentList
            ref='componentList'
            items={componentArray}
            componentForItem={(item) => {
              if (item === BUSINESS_LIST_GAP_PLACEHOLDER) {
                return <View style={{ height: 10 }}/>
              }
              if (item.isSelected) {
                return <SelectedBusiness business={item}/>
              }
              return <BusinessListItem business={item} />
            }}
            onPressItem={(index) => componentArray[index].id &&
              this.props.openTraderModal(componentArray[index].id)}/>
        </ScrollingExpandPanel>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  closestBusinesses: state.business.closestBusinesses.filter(b => b.id !== state.business.selectedBusinessId),
  selectedBusiness: state.business.businessList.find(b => b.id === state.business.selectedBusinessId)
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ openTraderModal }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
