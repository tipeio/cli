import prompts from 'prompts'
import { Project, Env, PromptHooks, ProjectConfig } from '../types'
import chalk from 'chalk'

export const initPrompts = async (projects: Project[], hooks: PromptHooks): Promise<ProjectConfig> => {
  const { selectedProject } = await prompts({
    type: 'select',
    name: 'selectedProject',
    message: 'Select or create a Project',
    choices: [
      { title: 'CREATE NEW PROJECT', value: { id: 0 } },
      ...projects.map((p: Project) => ({
        title: `${chalk.yellow(p.id)}   ${p.name}`,
        value: p,
      })),
    ],
  })

  let env, project

  if (selectedProject.id === 0) {
    const { projectName } = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Give your project a name.',
      initial: 'My Tipe Project',
    })

    project = await hooks.onCreateProject({ name: projectName })
    env = project.environments[0]
  } else {
    project = selectedProject
    const { selectedEnv } = await prompts({
      type: 'select',
      name: 'selectedEnv',
      message: 'Select or create an Environment',
      choices: [
        { title: 'CREATE NEW ENVIRONMENT', value: { id: 0 } },
        ...project.environments.map((e: Env) => ({
          title: `${chalk.yellow(e.id)}   ${e.name} (${e.private ? chalk.red('Private') : chalk.green('Public')})`,
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
        message: `Make "${envName}" private? (Will need an API to get content)`,
        initial: false,
        inactive: 'no',
        active: 'yes',
      })

      env = await hooks.onCreateEnv({ name: envName, project: project.id, private: envPrivate })
    } else {
      env = selectedEnv
    }
  }

  return { project, env }
}
