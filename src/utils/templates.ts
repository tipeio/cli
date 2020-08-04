/**
 * Create your schema here
 */
export const schemaTemplate = {
  deps: ['@tipe/js'],
  string: `const { createSchema } = require('@tipe/js')

module.exports = createSchema([
  /**
   * Modify and add your schema here
   * */
  {
    id: 'homePage',
    type: 'document',
    label: 'Home Page',
    fields: [
      {
        id: 'title',
        type: 'string',
        label: 'Title'
      }
    ]
  },
])
  `,
}

export const fieldsTemplate: any = {
  deps: [],
  string: `module.exports = {
    // Add any custom fields here
  }`,
}
