/**
 * Create your schema here
 */

const TipeDemoDoc = 'tipeDemoPage'

export const schemaTemplate = {
  deps: ['@tipe/js'],
  string: `const { createSchema, TipeFields } = require('@tipe/js')

module.exports = createSchema([
  /**
   * Modify and add your schema here
   * */
  {
    id: '${TipeDemoDoc}',
    type: 'document',
    label: 'Tipe Demo Page',
    previewPath: '/tipe-demo',
    fields: [
      {
        id: 'title',
        type: 'string',
        label: 'Title'
      },
      {
        id: 'content',
        type: 'string',
        label: 'Content',
        component: TipeFields.markdown
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

export const demoTemplate = (): string => {
  return `
    import Head from 'next/head'
    import styles from '../styles/Home.module.css'
    import { getTipe } from '@tipe/next'

    export default function TipeDemo({ documents }) {
      return(
        <div className={styles.container}>
          <Head>
            <title>Create Next App</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
            <h1 className={styles.title}>
              Welcome to <a href="https://nextjs.org">{documents[0].fields.title}</a>
            </h1>

            <p className={styles.description}>
              Get started by editing{' '}
              <code className={styles.code}>pages/index.js</code>
            </p>
          </main>
        </div>
      )
    }

    export const getStaticProps = async (ctx) => {
      const { tipe } = getTipe(ctx)
      const { documents } = await tipe.getDocuments({ type: '${TipeDemoDoc}' })
      return { props: { documents } }
    }
  `
}

export const pageTemplate = (page: string, options): string => {
  return `
  import React from 'react'
  import Head from 'next/head'
  import dynamic from 'next/dynamic'
  import { WithTipePage, typography } from '@tipe/react-editor'
  import Link from 'next/link'
  import Router from 'next/router'
  import { createTipeClient } from '@tipe/js'
  import { TypographyStyle } from 'react-typography'

  let schema = require('${options.schemaPath}')
  let customFields = require('${options.customFieldsPath}')

  if (customFields.default) {
    customFields = customFields.default
  }

  if (schema.default) {
    schema = schema.default
  }

  const TipePage = dynamic(() => import('@tipe/react-editor').then(mod => mod.${page}), { ssr: false })
  const ${page} = props => <TipePage {...props} />
  
  const client = createTipeClient({
    environment: '${options.environment}',
    projectId: '${options.projectId}',
    key: process.env.TIPE_API_KEY,
    adminHost: '${options.adminHost || ''}',
    contentHost: '${options.contentHost || ''}',
    assetHost: '${options.assetHost || ''}'
  })
  
  const Page = WithTipePage(${page}, {
    client,
    schema,
    customFields,
    mountPath: '${options.mountPath}',
    project: '${options.projectId}',
    previewSecret: process.env.NEXT_PUBLIC_TIPE_PREVIEW_SECRET,
    contentHost: client.__config.contentHost,
    assetHost: client.__config.assetHost,
    adminHost: client.__config.adminHost,
    Link: ({ to, children, styles }) => (
      <Link href={to} passHref>
        <a sx={styles}>{children}</a>
      </Link>
    ),
    onNavigate: (to) => {
      let path = to
      if (path[0] !== '/') {
        path = '/' + path
      }
      Router.push(path)
    },
  })

  export default Page
`
}

export const previewRouteTemplate = (): string => {
  return `import { previewHandler } from '@tipe/next'

const clientOptions = {
  projectId: process.env.TIPE_PROJECT_ID,
  environment: process.env.TIPE_ENVIRONMENT,
  assetHost: process.env.TIPE_ASSET_HOST || '',
  contentHost: process.env.TIPE_CONTENT_HOST || '',
  adminHost: process.env.TIPE_ADMIN_HOST || '',
  key: process.env.TIPE_API_KEY || '',
}

export default async (req, res) => {
  previewHandler(req, res, clientOptions)
}`
}
