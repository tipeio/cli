import figlet from 'figlet'
import gradient from 'gradient-string'
import ls from 'log-symbols'
import boxen from 'boxen'
import chalk from 'chalk'

const header = gradient.vice(figlet.textSync('Tipe'))

const intro = `
Thanks for using Tipe. You're about 3 mins away from complete content freedom!
Lets's get started 🚀
`

const foundAuth = `${ls.success} Account found.`
const gettingProjects = '...Fetching your projects'
const projectsLoaded = 'Projects loaded'

const creatingProject = '... Creating Project'
const creatingEnv = '... Creating Environment'

const createdProject = 'Project created'
const createdEnv = 'Environment created'

const notAuthenticated = `Account not found`
const openingAuth = `Opening browser so you can signin or signup`
const waitingForAuth = '...Waiting for authentication'
const installing = '...Installing the Tipe dashboard, hold tight'
const installError = `${chalk.redBright.bold('Could not install the Tipe dashboard')}.

This might be an issue with your npm or yarn installation.
You can still install the Tipe dashboard:

${chalk.bold('* gatsby theme: "npm install -S gatsby-theme-tipe"')}
${chalk.bold('* standalone:   "git clone https://github.com/tipeio/dashboard-standalone"')}
`

const gatsbyDone = boxen(
  `${chalk.bold("You're all set")} 🎉!

To use the dashboard to edit content:
1. Start your gatsby app
2. Navigate to "/tipe"
3. Enjoy 🏆

Check out our docs for more:

${chalk.green('Guides')}         ${chalk.underline('https://tipe.io.docs')}
${chalk.green('API Reference')}  ${chalk.underline('https://tipe.io.docs')}
${chalk.green('Customizing')}    ${chalk.underline('https://tipe.io.docs')}
`,
  { borderColor: 'magenta', padding: 1 },
)

export default {
  header,
  gatsbyDone,
  openingAuth,
  installing,
  waitingForAuth,
  installError,
  intro,
  foundAuth,
  gettingProjects,
  projectsLoaded,
  creatingProject,
  creatingEnv,
  createdProject,
  createdEnv,
  notAuthenticated,
}
