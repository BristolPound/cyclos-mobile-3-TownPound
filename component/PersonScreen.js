import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../store/reducer/navigation'
import ProfileScreen from './profileScreen/ProfileScreen'

const PersonScreen = ({selectedPerson, dataSource, showPersonScreen}) =>(
  <ProfileScreen
    loaded={Boolean(selectedPerson)}
    image={selectedPerson.image}
    category={'person'}
    defaultImage={!Boolean(selectedPerson.image)}
    name={'@'+(selectedPerson.username)}
    username={''}
    headerExtension={() => null}
    dataSource={dataSource}
    onPressClose={() => showPersonScreen(false)}
    onPressExpand={()=> showPersonScreen(false)}
    />
)

const mapStateToProps = (state) => ({
  selectedPerson: state.person.personList.find(p => p.id === state.person.selectedPersonId),
  dataSource: state.person.personTransactionsDataSource
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonScreen)
