import devSettings from './envs/dev'
import prodSettings from './envs/prod'


const settings = Object.assign({
  fastmail: {
    senderEmail: 'jamie@jweatherby.dev',
    password: process.env.FASTMAIL_PASSWORD as string
  },
  ...(process.env.NODE_ENV === 'production' ? prodSettings : devSettings)
})

export default settings