import prompts from 'prompts'
import { Project, Env, PromptHooks, ProjectConfig, Dashboard } from '../types'
import { isGatsby } from '../utils/detect'

export const initPrompts = async (projects: Project[], hooks: PromptHooks): Promise<ProjectConfig> => {
  const { selectedProject } = await prompts({
    type: 'select',
    name: 'selectedProject',
    message: 'Select or create a Project',
    choices: [
      { title: 'CREATE NEW PROJECT', value: { id: 0 } },
      ...projects.map((p: Project) => ({
        title: `${p.id}   ${p.name}`,
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
    env = project.envs[0]
    // const { envName } = await prompts({
    //   type: 'text',
    //   name: 'envName',
    //   message: 'Give your environment a name.',
    //   initial: 'production',
    // })

    // const { envPrivate } = await prompts({
    //   type: 'toggle',
    //   name: 'envPrivate',
    //   message: `Make "${envName}" private? (Will need an API to read, can change whenver)`,
    //   initial: false,
    //   active: 'yes',
    //   inactive: 'no',
    // })

    // env = await hooks.createEnv({ name: envName, project: project.id, private: envPrivate })
  } else {
    project = selectedProject

    const { selectedEnv } = await prompts({
      type: 'select',
      name: 'selectedEnv',
      message: 'Select or create an Environment',
      choices: [
        { title: 'CREATE NEW ENVIRONMENT', value: { id: 0 } },
        ...project.envs.map((e: Env) => ({
          title: `${e.id}   ${e.name}`,
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
        message: `Make "${envName}" private? (Will need an API to read, can change whenver)`,
        initial: false,
        inactive: 'no',
        active: 'yes',
      })

      env = await hooks.onCreateEnv({ name: envName, project: project.id, private: envPrivate })
    } else {
      env = selectedEnv
    }
  }

  let dashboard: Dashboard
  if (isGatsby()) {
    const { dash } = await prompts({
      type: 'select',
      name: 'dash',
      message: 'Gatsby project detected. Install the Tipe dashboard as a Gatsby theme?',
      choices: [
        { title: 'Yes (Recommended)', value: 'gatsby-theme' },
        { title: 'No - install as a standalone app', value: 'standalone' },
      ],
    })

    dashboard = dash
  } else {
    dashboard = 'standalone'
  }

  return { project, env, dashboard }
}
