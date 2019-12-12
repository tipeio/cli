import iq from 'inquirer'
import { Project, Env, PromptHooks, PromptConfig } from '../types'

const project = (config: PromptConfig): iq.ListQuestion => {
  const projectChoices = [
    { name: 'Create new project', value: { id: 0 } },
    new iq.Separator(),
    ...config.projects!.map(p => ({
      name: p.name,
      value: p,
    })),
  ]

  return {
    type: 'list',
    name: 'project',
    message: 'Select or create your Tipe project',
    default: 'New Tipe project',
    choices: projectChoices,
  }
}

const newProject = (config: PromptConfig): iq.InputQuestion => ({
  name: 'newProject',
  message: 'Name your project',
  default: 'My Tipe project',
  when(answers: iq.Answers): boolean {
    const { project } = answers
    return project.id === 0
  },
  filter: config.hooks!.createProject,
})

const newEnv = (config: PromptConfig = {}): iq.InputQuestion => ({
  name: 'newEnv',
  message: 'Name your environment',
  default: 'production',
  when(answers: iq.Answers): boolean {
    return config.when ? config.when(answers) : Boolean(answers.newProject)
  },
  filter: config.hooks!.createEnv,
})

const envPrivate = (config: PromptConfig = {}): iq.ConfirmQuestion => {
  return {
    name: 'envPrivate',
    type: 'confirm',
    message(answers: iq.Answers): string {
      return `Private environments need an API to read content. Should "${answers.newEnv.name}" be Private? (Can change anytime)`
    },
    when(answers: iq.Answers): boolean {
      return config.when ? config.when(answers) : Boolean(answers.newEnv)
    },
  }
}

const selectEnv = (): iq.ListQuestion => {
  return {
    type: 'list',
    name: 'env',
    message: 'Select an environment',
    when(answers: iq.Answers): boolean {
      const { project } = answers
      return project.id !== 0
    },
    choices(answers: iq.Answers): iq.ChoiceCollection {
      const { envs } = answers.project
      let envChoices = [{ name: 'Create New Environment', value: { id: 0 } }, new iq.Separator()]

      if (envs.length) {
        envChoices = envChoices.concat(
          envs.map((e: Env) => ({
            name: e.name,
            value: e,
          })),
        )
      }

      return envChoices
    },
  }
}

const createEnvForOldProject = (answers: iq.Answers): boolean => answers.env && answers.env.id === 0
const envPrivateForOldProject = (answers: iq.Answers): boolean => answers.env && answers.env.id === 0

export const initPrompts = (projects: Project[], hooks: PromptHooks): iq.QuestionCollection => {
  return [
    project({ projects }),
    newProject({ hooks }),
    newEnv(),
    envPrivate({ hooks }),
    selectEnv(),
    newEnv({ when: createEnvForOldProject }),
    envPrivate({ when: envPrivateForOldProject, hooks }),
  ]
}
