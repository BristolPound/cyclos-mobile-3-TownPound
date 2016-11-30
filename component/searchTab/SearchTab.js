import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import ComponentList from './ComponentList'
import BusinessListItem, { SelectedBusiness } from './BusinessListItem'
import ScrollingExpandPanel from './ScrollingExpandPanel'
import styles, { SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN, maxExpandedHeight, maxCollapsedHeight } from './SearchTabStyle'
import { ROW_HEIGHT } from './BusinessListStyle'
import { openTraderModal } from '../../store/reducer/navigation'
import { BUSINESS_LIST_SELECTED_GAP } from './BusinessListStyle'

const BUSINESS_LIST_GAP_PLACEHOLDER = { pressable: false }

const SHORT_LIST_BOTTOM_GAP = 12
const EXPANDED_LIST_TOP_OFFSET = SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN

const calculatePanelHeight = (rowCount, selectedBusiness) => {
  const selectedBusinessModifier = selectedBusiness ? BUSINESS_LIST_SELECTED_GAP + ROW_HEIGHT : 0
  const collapsedHeight = Math.min(
    rowCount * ROW_HEIGHT + selectedBusinessModifier + SHORT_LIST_BOTTOM_GAP,
    maxCollapsedHeight
  ) - ((rowCount > 4) ? (ROW_HEIGHT - SHORT_LIST_BOTTOM_GAP) : 0)
  const expandedHeight = Math.max(
    Math.min(rowCount * ROW_HEIGHT + selectedBusinessModifier, maxExpandedHeight),
    collapsedHeight
  )
  const closedHeight = ROW_HEIGHT * Math.min(rowCount, 1)
  return ({ collapsedHeight, expandedHeight, closedHeight })
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
    const { closestBusinesses, openTraderModal, selectedBusiness } = this.props
    const { componentList } = this.refs

    const noOfCloseBusinesses = closestBusinesses.length,
        childrenHeight = selectedBusiness
            ? noOfCloseBusinesses * ROW_HEIGHT + BUSINESS_LIST_SELECTED_GAP
            : noOfCloseBusinesses * ROW_HEIGHT

    const { collapsedHeight, expandedHeight, closedHeight } = calculatePanelHeight(
      this.props.closestBusinesses.length,
      this.props.selectedBusiness
    )
    const calculatedOffset = height => EXPANDED_LIST_TOP_OFFSET + maxExpandedHeight - height
    const selectedComponentView = item => {
        if (item === BUSINESS_LIST_GAP_PLACEHOLDER) {
            return <View style={{ height: 10 }}/>
        }
        if (item.isSelected) {
            return <SelectedBusiness business={item}/>
        }
        return <BusinessListItem business={item} />
    }

    const componentArray = this.createComponentArray()

    return (
      <View style={{flex: 1}}>
        <BackgroundMap/>
        <ScrollingExpandPanel
          style={styles.searchTab.expandPanel}
          topOffset={[ calculatedOffset(expandedHeight), calculatedOffset(collapsedHeight), calculatedOffset(closedHeight) ]}
          expandedHeight={expandedHeight}
          onPressRelease={hasMoved => componentList.handleRelease(hasMoved)}
          onPressStart={location => componentList.highlightItem(location)}
          childrenHeight={childrenHeight}
          startPosition={1}>
          <ComponentList
            ref='componentList'
            items={componentArray}
            componentForItem={selectedComponentView}
            onPressItem={index => componentArray[index].id && openTraderModal(componentArray[index].id)} />
        </ScrollingExpandPanel>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  closestBusinesses: state.business.closestBusinesses.filter(b => b.id !== state.business.selectedBusinessId),
  selectedBusiness: state.business.businessList.find(b => b.id === state.business.selectedBusinessId)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ openTraderModal }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
