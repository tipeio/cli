import prompts from 'prompts'
import { Project, Env, PromptHooks, ProjectConfig } from '../types'
import chalk from 'chalk'

export const initPrompts = async (
  projects: Project[],
  organization: string,
  hooks: PromptHooks,
): Promise<ProjectConfig> => {
  let env, project
  let orgId = organization
  if (!orgId) {
    const { projectName } = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Give your project a name.',
      initial: 'My Tipe Project',
    })

    const onCreateProjectOptions = {
      projectName,
      [organization ? 'orgId' : 'orgName']: orgId,
    }

    project = await hooks.onCreateProject(onCreateProjectOptions)
    env = project.environments[0]
  } else {
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

    if (selectedProject.id === 0) {
      const { projectName } = await prompts({
        type: 'text',
        name: 'projectName',
        message: 'Give your project a name.',
        initial: 'My Tipe Project',
      })

      let onCreateProjectOptions = {
        projectName,
        [organization ? 'orgId' : 'orgName']: orgId,
      }

      const { selectedOrg } = await prompts({
        type: 'select',
        name: 'selectedOrg',
        message: 'Create or select an Organization',
        choices: [
          { title: 'CREATE NEW ORGANIZATION', value: { id: 0 } },
          {
            title: `${chalk.yellow(orgId)}`,
            value: orgId,
          },
        ],
      })

      if (selectedOrg.id === 0) {
        const { orgName } = await prompts({
          type: 'text',
          name: 'orgName',
          message: 'Give your organization a name.',
          initial: 'production',
        })
        orgId = orgName

        onCreateProjectOptions = {
          projectName,
          orgName: orgName,
        }

        project = await hooks.onCreateProject(onCreateProjectOptions)
        env = project.environments[0]
      } else {
        project = await hooks.onCreateProject(onCreateProjectOptions)
        env = project.environments[0]
      }
    } else {
      project = selectedProject
    }
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

  const { writeEnv } = await prompts({
    type: 'confirm',
    name: 'writeEnv',
    message: 'Add tipe env variables to your .env file?',
    initial: true,
  })

  return { project, env, writeEnv }
}
