import _ from 'lodash'
import React from 'react'
import { View } from 'react-native'
import { createMigrate } from 'redux-persist'
import migrations from '../store/migrations'
import Config from '@Config/config'

export const STORE_VERSION = _.max(Object.keys(migrations))

export const Loading = <View style={{flex: 1}}/>

export const storeMigration = createMigrate(migrations, { debug: true })
/*export const storeMigration = (state) => {
    console.log('Migration Running!')
    return Promise.resolve(state)
  }
*/

export default storeMigration
