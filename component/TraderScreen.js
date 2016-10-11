import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import styles from './profileScreen/ProfileStyle'
import ProfileScreen from './profileScreen/ProfileScreen'
import BusinessDetails from './businessDetails/BusinessDetails'
import HTMLView from 'react-native-htmlview'
import {View} from 'react-native'
import SendMoney from './SendMoney'

const renderHeaderExtension = (selectedBusiness) => () => (
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

class TraderScreen extends React.Component {
    render() {
        let selectedBusiness = this.props.selectedBusiness
        return <View style={{flex: 1}}>
            <ProfileScreen
                loaded={selectedBusiness.profilePopulated}
                image={selectedBusiness.image}
                category={'shop'}
                defaultImage={!Boolean(selectedBusiness.image)}
                name={selectedBusiness.display}
                username={selectedBusiness.shortDisplay}
                renderHeaderExtension={renderHeaderExtension(selectedBusiness)}
                dataSource={this.props.dataSource}
                onPressClose={() => this.props.showTraderScreen(false)}
                onPressExpand={()=> this.props.showTraderScreen(false)}
            />
            <View style={styles.footer}>
                <SendMoney
                    payeeDisplay={selectedBusiness.name}
                    payeeShortDisplay={selectedBusiness.shortDisplay}/>
            </View>
        </View>
    }
}

// Redux Setup
const mapStateToProps = (state) => ({
  selectedBusiness: state.business.businessList.find(b => b.id === state.business.selectedBusinessId),
  dataSource: state.business.traderTransactionsDataSource
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
