import iq from 'inquirer'
import { Project, Env } from '../types'

const project = (projects: Project[]): iq.ListQuestion => {
  const projectChoices = [
    { name: 'Create new project', value: { id: 0 } },
    new iq.Separator(),
    ...projects.map(p => ({
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

const newProject = (): iq.InputQuestion => ({
  name: 'newProject',
  message: 'Name your project',
  default: 'My Tipe project',
  when(answers: iq.Answers): boolean {
    const { project } = answers
    return project.id === 0
  },
})

const newEnv = (when?: Function): iq.InputQuestion => ({
  name: 'newEnv',
  message: 'Name your environment',
  default: 'production',
  when(answers: iq.Answers): boolean {
    return when ? when(answers) : Boolean(answers.newProject)
  },
})

const envPrivate = (when?: Function): iq.ConfirmQuestion => {
  return {
    name: 'envPrivate',
    type: 'confirm',
    message(answers: iq.Answers): string {
      return `Private environments need an API to read content. Should ${answers.newEnv} be Private? (Can change anytime)`
    },
    when(answers: iq.Answers): boolean {
      return when ? when(answers) : Boolean(answers.newEnv)
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

export const initPrompts = (projects: Project[]): iq.QuestionCollection => {
  return [
    project(projects),
    newProject(),
    newEnv(),
    envPrivate(),
    selectEnv(),
    newEnv(createEnvForOldProject),
    envPrivate(envPrivateForOldProject),
  ]
}
