import devSettings from './envs/dev'
import prodSettings from './envs/prod'


const settings = Object.assign({
  ...(process.env.NODE_ENV === 'production' ? prodSettings : devSettings)
})

export default settings