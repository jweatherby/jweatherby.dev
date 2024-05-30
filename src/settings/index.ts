import devSettings from './dev'
import prodSettings from './prod'


const settings = process.env.NODE_ENV === 'production' ? prodSettings : devSettings

export default settings