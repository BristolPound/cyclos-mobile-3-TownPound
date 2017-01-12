import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import merge from '../../util/merge'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import ComponentList from './ComponentList'
import BusinessListItem, { SelectedBusiness } from './BusinessListItem'
import ScrollingExpandPanel from './ScrollingExpandPanel'
import styles, { SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN, maxExpandedHeight } from './SearchTabStyle'
import { ROW_HEIGHT, BUSINESS_LIST_SELECTED_GAP} from './BusinessListStyle'
import { updateSearchMode, updateMapViewport } from '../../store/reducer/business'
import { openTraderModal } from '../../store/reducer/navigation'
import { Overlay } from '../common/Overlay'
import Search from './Search'
import calculatePanelHeight from '../../util/calculatePanelHeight'

const BUSINESS_LIST_GAP_PLACEHOLDER = { pressable: false }

const EXPANDED_LIST_TOP_OFFSET = SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN

const ComponentForItem = item => {
    if (item === BUSINESS_LIST_GAP_PLACEHOLDER) {
        return <View style={{ height: 10 }}/>
    }
    if (item.isSelected) {
        return <SelectedBusiness business={item}/>
    }
    return <BusinessListItem business={item} />
}

class SearchTab extends React.Component {
  constructor(props) {
    super()
    this.componentListArray = this.createComponentListArray(props)
  }

  createComponentListArray(props) {
    const makePressable = (itemProps) => ({...itemProps, pressable: true})
    if (props.selectedBusiness) {
      return [
        { ...makePressable(props.selectedBusiness), isSelected: true },
        BUSINESS_LIST_GAP_PLACEHOLDER,
        ...props.closestBusinesses.map(makePressable)
      ]
    } else {
      return props.closestBusinesses.map(makePressable)
    }
  }

  calculateOffset(heights) {
    return heights.map(height => EXPANDED_LIST_TOP_OFFSET + maxExpandedHeight - height)
  }

  componentWillReceiveProps(nextProps) {
    this.componentListArray = this.createComponentListArray(nextProps)
  }

  render() {
    const { allBusinesses, closestBusinesses, openTraderModal, selectedBusiness, searchMode, updateSearchMode,
        geolocationStatus, mapViewport, updateMapViewport } = this.props
    const { componentList } = this.refs

    const noOfCloseBusinesses = closestBusinesses.length,
        childrenHeight = selectedBusiness
            ? (noOfCloseBusinesses + 1) * ROW_HEIGHT + BUSINESS_LIST_SELECTED_GAP
            : noOfCloseBusinesses * ROW_HEIGHT

    const { collapsedHeight, expandedHeight, closedHeight } = calculatePanelHeight(
      this.props.closestBusinesses.length,
      this.props.selectedBusiness
    )

    const exitSearchMode = () => {
      this.refs.search.closeSearchScreen()
    }

    return (
      <View style={{flex: 1}}>
        <BackgroundMap/>
        { searchMode && <Overlay overlayVisible={true} onPress={exitSearchMode}/> }
        <Search businessList={allBusinesses}
                updateSearchMode={updateSearchMode}
                searchMode={searchMode}
                openTraderModal={openTraderModal}
                ref='search'
                geolocation={geolocationStatus}
                mapViewport={mapViewport}
                updateMapViewport={updateMapViewport}/>
        <ScrollingExpandPanel
            style={merge(styles.searchTab.expandPanel, (searchMode ? styles.searchTab.hide : {})) }
            topOffset={this.calculateOffset([ expandedHeight, collapsedHeight, closedHeight ])}
            expandedHeight={expandedHeight}
            onPressRelease={hasMoved => componentList && componentList.handleRelease(hasMoved)}
            onPressStart={location => componentList && componentList.highlightItem(location)}
            childrenHeight={childrenHeight + BUSINESS_LIST_SELECTED_GAP}
            startPosition={1}>
            <ComponentList
                ref='componentList'
                items={this.componentListArray}
                componentForItem={ComponentForItem}
                onPressItem={index => this.componentListArray[index].id && openTraderModal(this.componentListArray[index].id)} />
        </ScrollingExpandPanel>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  closestBusinesses: state.business.closestBusinesses.filter(b => b.id !== state.business.selectedBusinessId),
  selectedBusiness: state.business.businessList.find(b => b.id === state.business.selectedBusinessId),
  allBusinesses: state.business.businessList,
  searchMode: state.business.searchMode,
  mapViewport: state.business.mapViewport,
  geolocationStatus: state.business.geolocationStatus
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ openTraderModal, updateSearchMode, updateMapViewport }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
