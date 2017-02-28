import React from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BackgroundMap from './BackgroundMap'
import ComponentList from './ComponentList'
import BusinessListItem, { SelectedBusiness } from './BusinessListItem'
import DraggableList from './DraggableList'
import styles, { SEARCH_BAR_HEIGHT, SEARCH_BAR_MARGIN, maxExpandedHeight } from './SearchTabStyle'
import { ROW_HEIGHT, BUSINESS_LIST_SELECTED_GAP} from './BusinessListStyle'
import * as actions from '../../store/reducer/business'
import { Overlay } from '../common/Overlay'
import Search from './Search'
import calculatePanelHeight from '../../util/calculatePanelHeight'

const BUSINESS_LIST_GAP_PLACEHOLDER = { pressable: false }

const EXPANDED_LIST_TOP_OFFSET = SEARCH_BAR_HEIGHT + SEARCH_BAR_MARGIN

const listCroppedLength = Math.ceil(Dimensions.get('window').height / ROW_HEIGHT)



class SearchTab extends React.Component {
  constructor(props) {
    super()
    this.state = { componentListArray: this.createComponentListArray(props).slice(0, listCroppedLength) }
    this.listPosition = 1
  }

  ComponentForItem(item, deselect) {
      if (item === BUSINESS_LIST_GAP_PLACEHOLDER) {
          return <View style={{ height: 10 }}/>
      }
      if (item.isSelected) {
          return <SelectedBusiness business={item} deselect={deselect}/>
      }
      return <BusinessListItem business={item} />
  }

  createComponentListArray(props = this.props) {
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
    let mapMoved = false
    nextProps.closestBusinesses.forEach((b, index) => {
      if (!this.props.closestBusinesses[index] || b.id !== this.props.closestBusinesses[index].id) {
        mapMoved = true
      }
    })
    if (nextProps.selectedBusiness !== this.props.selectedBusiness || mapMoved) {
      const componentListArray = this.createComponentListArray(nextProps)
      this.state.componentListArray = this.listPosition
        ? componentListArray.slice(0, listCroppedLength)
        : componentListArray
    }
  }

  onPositionChange(position) {
    if (position === 0 && this.listPosition !== 0) {
      this.setState({ componentListArray: this.createComponentListArray() })
    }
    this.listPosition = position
  }

  render() {
    const { closestBusinesses, openTraderModal, selectedBusiness, searchMode, updateSearchMode } = this.props
    const { componentList } = this.refs

    const noOfCloseBusinesses = closestBusinesses.length,
        childrenHeight = selectedBusiness
            ? (noOfCloseBusinesses + 1) * ROW_HEIGHT + BUSINESS_LIST_SELECTED_GAP
            : noOfCloseBusinesses * ROW_HEIGHT

    const { collapsedHeight, expandedHeight, closedHeight } = calculatePanelHeight(
      this.props.closestBusinesses.length,
      this.props.selectedBusiness
    )

    return (
      <View style={{flex: 1}}>
        <BackgroundMap />
        {!searchMode && <DraggableList ref={this.props.registerBusinessList}
            style={styles.searchTab.expandPanel}
            topOffset={this.calculateOffset([ expandedHeight, collapsedHeight, closedHeight ])}
            expandedHeight={expandedHeight}
            onTouchEnd={hasMoved => componentList && componentList.handleRelease(hasMoved)}
            onTouchStart={location => componentList && componentList.highlightItem(location)}
            onMove={() => componentList && componentList.handleRelease(true)}
            childrenHeight={childrenHeight + BUSINESS_LIST_SELECTED_GAP}
            startPosition={1}
            onPositionChange={(position) => this.onPositionChange(position)}>
            <ComponentList
                ref='componentList'
                items={this.state.componentListArray}
                componentForItem={this.ComponentForItem}
                deselect={() => this.props.selectBusiness(undefined)}
                onPressItem={index => this.state.componentListArray[index].id && openTraderModal(this.state.componentListArray[index].id)} />
        </DraggableList>}
        {searchMode && <Overlay overlayVisible={true} onPress={() => updateSearchMode(false)} />}
        <Search {...this.props} />
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

const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTab)
