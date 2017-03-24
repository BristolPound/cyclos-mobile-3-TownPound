import React from 'react'
import { ScrollView, TouchableHighlight, View } from 'react-native'
import colors from '../../util/colors'

const FixedScrollableList = (props) =>
  	<View style={props.style}>
      	<ScrollView>
	        {props.items.map((item, index) =>
	            //zIndex is required for overflow to work on android
	            <TouchableHighlight
	            	style={{ backgroundColor: item.pressable ? 'white' : 'transparent',
	            			overflow: 'hidden',
	            			zIndex: 100,
	            			flex: 1 }}
	            	key={item.id || index}
	            	underlayColor={colors.offWhite}
	            	onPress={() => props.onPress(item.id)}>
	              		{props.componentForItem(item)}
	            </TouchableHighlight>
			)}
      	</ScrollView>
  	</View>

export default FixedScrollableList
