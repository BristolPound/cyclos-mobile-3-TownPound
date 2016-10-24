import PLATFORM from './Platforms'

const marginOffset = (val) =>
  PLATFORM.isAndroid() ? val - 15 : val

export default marginOffset
