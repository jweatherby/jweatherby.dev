import devSettings from './envs/dev'
import prodSettings from './envs/prod'


const settings = process.env.NODE_ENV === 'production' ? prodSettings : devSettings

export default settings