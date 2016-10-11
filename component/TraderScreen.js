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
import {Text} from 'react-native'
import {TouchableOpacity} from 'react-native'

class TraderScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {displayDetails: !props.isExistingCustomer}
    }

    render() {
        let trader = this.props.trader
        return <View style={{flex: 1}}>
            <ProfileScreen
                loaded={trader.profilePopulated}
                image={trader.image}
                category={'shop'}
                defaultImage={!Boolean(trader.image)}
                name={trader.display}
                username={trader.shortDisplay}
                renderHeaderExtension={() => this.renderHeaderExtension()}
                dataSource={this.props.dataSource}
                onPressClose={() => this.props.showTraderScreen(false)}
                onPressExpand={()=> this.props.showTraderScreen(false)}
            />
            <View style={styles.footer}>
                <SendMoney
                    payeeDisplay={trader.name}
                    payeeShortDisplay={trader.shortDisplay}/>
            </View>
        </View>
    }

    renderHeaderExtension () {
        return <View style={styles.dropshadow}>
            <BusinessDetails business={this.props.trader}/>
            {this.renderDescription()}
        </View>
    }

    // if there's a description render it either as html or a view details button.
    // Ironically the details to be displayed is the description, not the business details (address etc.)
    // that are always displayed.
    renderDescription() {
        return (this.state.displayDetails) ?
            <View style={styles.businessDetails.description}>
                <HTMLView value={this.props.trader.description}/>
            </View> :
            <TouchableOpacity onPress={() => this.setState({displayDetails: true})}>
                <View><Text>View Details</Text></View>
            </TouchableOpacity>
    }

    renderIfDescription() {
        return (this.props.trader.description) ?
            <View>
                <View style={styles.separator}/>
                { this.renderDescription() }
            </View> : null
    }
}

// Redux Setup
const mapStateToProps = (state) => ({
    trader: state.business.businessList.find(b => b.id === state.business.selectedBusinessId),
    dataSource: state.business.traderTransactionsDataSource, // ListView.DataSource
    isExistingCustomer: state.business.traderTransactionsDataSource.getRowCount() > 0,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(TraderScreen)
