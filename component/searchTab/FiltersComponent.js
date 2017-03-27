import React from 'react'
import { View, Image } from 'react-native'
import DefaultText from '../DefaultText'
import ProfileImage from '../profileImage/ProfileImage'
import FixedScrollableList from './FixedScrollableList'
import { allFilters } from '../../store/reducer/business'
import styles from './BusinessListStyle'
import searchTabStyle from './SearchTabStyle'

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

const { searchHeaderText, fixedScrollableListContainer } = searchTabStyle.searchTab

const ComponentForItem = (item, onPress) => {
  if (typeof item === 'string') {
    return  <DefaultText style={searchHeaderText}>
                { item }
            </DefaultText>
  }
   return (
          <View style={styles.listItem.contents}>
              <ProfileImage image={images[item.label]}
                  style={styles.listItem.image}
                  category={'shop'}
                  borderColor='offWhite'/>
              <View style={styles.filterItem.filterContainer}>
                  <DefaultText style={styles.filterItem.filterText}>
                      {item.text}
                  </DefaultText>
                  {item.filterActive
                    && <Image style={styles.filterItem.filterTick} source={TICK} />}
              </View>
          </View> )
}

export default class FiltersComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = { componentListArray: this.createComponentListArray(allFilters) }
    }

    componentWillReceiveProps(nextProps) {
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
      return (
          <FixedScrollableList
              style={fixedScrollableListContainer}
              items={this.state.componentListArray}
              componentForItem={ComponentForItem}
              onPress={(item) => this._filtersListOnClick(item)}>
          </FixedScrollableList>
        )
    }
}
