import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import styles from './profileScreen/ProfileStyle'
import ProfileScreen from './profileScreen/ProfileScreen'
import BusinessDetails from './businessDetails/BusinessDetails'
import HTMLView from 'react-native-htmlview'
import {View} from 'react-native'

const TraderScreen = ({selectedBusiness, dataSource, showTraderScreen}) =>(
  <ProfileScreen
    loaded={selectedBusiness.profilePopulated}
    image={selectedBusiness.image}
    category={'shop'}
    defaultImage={!Boolean(selectedBusiness.image)}
    name={selectedBusiness.display}
    username={selectedBusiness.shortDisplay}
    headerExtension={headerExtension(selectedBusiness)}
    dataSource={dataSource}
    onPressClose={() => showTraderScreen(false)}
    onPressExpand={()=> showTraderScreen(false)}
    />
)

const headerExtension = (selectedBusiness) => () => (
  <View style={styles.dropshadow}>
     <BusinessDetails business={selectedBusiness}/>
    {selectedBusiness.description ? <View style={styles.separator}/> : null}
    {selectedBusiness.description
      ? <View style={styles.businessDetails.description}>
          <HTMLView value={selectedBusiness.description}/>
        </View>
      : null }
  </View>
)

const mapStateToProps = (state) => ({
  selectedBusiness: state.business.businessList.find(b => b.id === state.business.selectedBusinessId),
  dataSource: state.business.traderTransactionsDataSource
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
