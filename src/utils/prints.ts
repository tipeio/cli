import figlet from 'figlet'
import gradient from 'gradient-string'
import ls from 'log-symbols'
import boxen from 'boxen'
import chalk from 'chalk'

const header = gradient.vice(figlet.textSync('Tipe'))
const creatingAPIKey = `...Creating API Key`
const errorCreatingAPIKey = 'Could not create an API Key'

const intro = `
Thanks for using Tipe. You're about 3 mins away from complete content freedom!
Lets's get started 🚀
`

const foundAuth = `${ls.success} Account found.`
const alreadyAuth = `${ls.info} Account found. You're already signed in. To signout run:
tipe signout
`
const signedout = `${ls.success} Successfully signed out`
const authError = `Oh no :(. We are having trouble right now.`
const gettingProjects = '...Fetching your projects'
const projectsLoaded = 'Projects loaded'
const projectsError = 'Could not get Projects'
const noProjects = `You don't have any projects. To create one run:

tipe init
`
const authenticated = (_: TemplateStringsArray, email: any): string =>
  `Authentication for ${email} sucess 💯. Saving for next time`

const creatingFirstProject = '... Creating your first Project and Environment'
const createdFirstProject = (_: TemplateStringsArray, project: string, environment: string): string =>
  `Created Project "${project}" and Environment "${environment}"`
const creatingProject = '... Creating Project'
const creatingEnv = '... Creating Environment'

const createdProject = 'Project created'
const createdEnv = 'Environment created'
const needToAuth = `Account not found. To get started run:

tipe init
`

const notAuthenticated = `Account not found`
const openingAuth = `Opening browser so you can signin or signup 😘`
const waitingForAuth = '...Waiting for you to finish authenticating 😴'
const installing = '...Installing the Tipe dashboard, hold tight 👀'
const installError = `${chalk.redBright.bold('Could not install the Tipe dashboard')}.

This might be an issue with your npm or yarn installation.
You can still install the Tipe dashboard:

${chalk.bold('* gatsby theme: "npm install -S gatsby-theme-tipe"')}
${chalk.bold('* standalone:   "git clone https://github.com/tipeio/dashboard-standalone"')}
`

const installed = (_: TemplateStringsArray, dashboard: any): string => `Tipe dashboard (${dashboard}) installed 😎`

const done = (message: string) =>
  boxen(
    `${chalk.bold("You're all set")} 🎉!

${message}

Check out our docs for more:

${chalk.green('Guides')}         ${chalk.underline('https://tipe.io.docs')}
${chalk.green('API Reference')}  ${chalk.underline('https://tipe.io.docs')}
${chalk.green('Customizing')}    ${chalk.underline('https://tipe.io.docs')}
`,
    { borderColor: 'magenta', padding: 1 },
  )

const detectingFramework = `Detecting framework 👀`

export default {
  detectingFramework,
  header,
  done,
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
  authError,
  authenticated,
  installed,
  creatingFirstProject,
  createdFirstProject,
  needToAuth,
  projectsError,
  noProjects,
  alreadyAuth,
  signedout,
  errorCreatingAPIKey,
  creatingAPIKey,
}
