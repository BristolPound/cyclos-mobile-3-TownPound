import { Animated, Easing } from 'react-native'

// utility for animations. 'easing' and 'callback' are optional
const animateTo = (parameterToAnimate, value, duration, easing, callback) => {
  /*
    duration re-assignment is to fix timing animation breaking due to receiving duration = NaN
    and prevent setting the draggable list behind the search bar
  */
  duration = duration ? duration : 0
  
  Animated.timing(parameterToAnimate, {
    toValue: value,
    easing: easing || Easing.out(Easing.ease),
    duration
  }).start(callback)
}

export default animateTo
