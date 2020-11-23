import prompts from 'prompts'
import {
  Project,
  Env,
  ProjectConfig,
  Organziation,
  HandleInitAccountFn,
  InitPromptAnswers,
  InitAccountResult,
} from '../types'
import chalk from 'chalk'

export const askInitQuestions = async (
  orgs: Organziation[],
  handleInitAccount: HandleInitAccountFn,
): Promise<ProjectConfig> => {
  let result: InitAccountResult
  let org, project, env

  try {
    if (!orgs.length) {
      result = await handleInitAccount(
        {
          orgName: 'Personal',
          projectName: 'My First Project',
          envName: 'Production',
        },
        true,
      )
    } else {
      const config: InitPromptAnswers = {}

      const { selectedOrg } = await prompts({
        type: 'select',
        name: 'selectedOrg',
        message: 'Select or create an Organization',
        choices: [
          { title: 'Create a new Organization', value: { id: 0, projects: [] } },
          ...orgs.map((org: Organziation) => ({
            title: chalk.yellow(org.name),
            value: org,
          })),
        ],
      })

      if (selectedOrg.id === 0) {
        const { orgName } = await prompts({
          type: 'text',
          name: 'orgName',
          message: 'Give your Organization a name.',
          initial: 'My Organization',
        })

        config.orgName = orgName
      } else {
        config.orgId = selectedOrg.id || selectedOrg._id
        org = selectedOrg
      }

      if (org && org.projects.length) {
        const { selectedProject } = await prompts({
          type: 'select',
          name: 'selectedProject',
          message: 'Select or create a Project',
          choices: [
            { title: 'Create a new Project', value: { id: 0, environments: [] } },
            ...selectedOrg.projects.map((p: Project) => ({
              title: chalk.yellow(p.name),
              value: p,
            })),
          ],
        })

        if (selectedProject.id === 0) {
          const { projectName } = await prompts({
            type: 'text',
            name: 'projectName',
            message: 'Give your project a name.',
            initial: 'My Tipe Project',
          })

          config.projectName = projectName
        } else {
          config.projectId = selectedProject.id || selectedProject._id
          project = selectedProject
        }
      } else {
        const { projectName } = await prompts({
          type: 'text',
          name: 'projectName',
          message: 'Name your first Project',
          initial: 'My Tipe Project',
        })

        config.projectName = projectName
      }

      if (project && project.environments.length) {
        const { selectedEnv } = await prompts({
          type: 'select',
          name: 'selectedEnv',
          message: 'Select or create an Environment',
          choices: [
            { title: 'Create a new Environment', value: { id: 0 } },
            ...project.environments.map((e: Env) => ({
              title: `${e.name} (${e.private ? chalk.red('Private') : chalk.green('Public')})`,
              value: e,
            })),
          ],
        })

        if (selectedEnv.id === 0) {
          const { envName } = await prompts({
            type: 'text',
            name: 'envName',
            message: 'Give your environment a name.',
            initial: 'production',
          })

          const { envPrivate } = await prompts({
            type: 'toggle',
            name: 'envPrivate',
            message: `Make "${envName}" private? (API Key required to access content)`,
            initial: false,
            inactive: 'no',
            active: 'yes',
          })

          config.envName = envName
          config.envPrivate = envPrivate
        } else {
          config.envId = selectedEnv.id || selectedEnv._id
          env = selectedEnv
        }
      } else {
        const { envName } = await prompts({
          type: 'text',
          name: 'envName',
          message: 'Give your environment a name.',
          initial: 'production',
        })

        const { envPrivate } = await prompts({
          type: 'toggle',
          name: 'envPrivate',
          message: `Make "${envName}" private? (API Key required to access content)`,
          initial: false,
          inactive: 'no',
          active: 'yes',
        })

        config.envName = envName
        config.envPrivate = envPrivate
      }

      if (config.envName) {
        result = await handleInitAccount(config)
      } else {
        result = {
          org,
          project,
          env,
        }
      }
    }

    const { writeEnv } = await prompts({
      type: 'toggle',
      name: 'writeEnv',
      message: 'Should we add tipe env variables to your .env file?',
      initial: true,
      inactive: 'no',
      active: 'yes',
    })

    return { ...result, writeEnv }
  } catch (e) {
    throw new Error('✖ Could not initialize Tipe.')
  }
  // users first org must be a personal org. No need to ask
}
