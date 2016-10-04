import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../store/reducer/navigation'


export const TraderScreen = props =>
  <ProfileScreen
    additionalDetails={() => (
      <BusinessDetails/>
    )}
    dataSource={props.dataSource}
    />

const mapStateToProps = (state) => ({
  selectedBusiness: state.business.businessList.find(b => b.id === state.business.selectedBusinessId),
  dataSource: state.business.traderTransactionsDataSource
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
