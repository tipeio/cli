import figlet from 'figlet'
import gradient from 'gradient-string'
import ls from 'log-symbols'

const header = gradient.vice(figlet.textSync('Tipe'))

const intro = `
Thanks for using Tipe. You're about 3 mins away from complete content freedom!
Lets's get started 🚀
`

const foundAuth = `${ls.success} You're already authenticated.`
const gettingProjects = '...Fetching your projects'
const projectsLoaded = 'Projects loaded'

export default {
  header,
  intro,
  foundAuth,
  gettingProjects,
  projectsLoaded,
}
