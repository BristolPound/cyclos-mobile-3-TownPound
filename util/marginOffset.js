import PLATFORM from './Platforms'

const marginOffset = (val) =>
// TODO: Status bar height is different on different devices - https://www.npmjs.com/package/react-native-extra-dimensions-android
  PLATFORM.isAndroid() ? val - 25 : val

export default marginOffset
