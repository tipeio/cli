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
    previewPath: '/',
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

export const pageTemplate = (page: string, options): string => {
  return `
  /** @jsx jsx */
  import { jsx } from 'theme-ui'
  import React from 'react'
  import Head from 'next/head'
  import { ${page}, WithTipePage, typography } from '@tipe/react-editor'
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

  export default () => {
    return (
      <div>
        <TypographyStyle typography={typography} />
        <Page />
      </div>
    )
  }
`
}

export const previewRouteTemplate = (): string => {
  return `import { createTipeClient } from '@tipe/js'

const clientOptions = {
  projectId: process.env.TIPE_PROJECT_ID,
  environment: process.env.TIPE_ENVIRONMENT,
  assetHost: process.env.TIPE_ASSET_HOST || '',
  contentHost: process.env.TIPE_CONTENT_HOST || '',
  adminHost: process.env.TIPE_ADMIN_HOST || '',
  key: process.env.TIPE_API_KEY || '',
}

const tipe = createTipeClient(clientOptions)

export default async (req, res) => {
  
  if ( !req.query.slug || !req.query.id) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  if( req.query.secret !== process.env.NEXT_PUBLIC_TIPE_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  const document = await tipe.getDocument({id: req.query.id, draft: true})

  if (!document) {
    return res.status(401).json({ message: 'Invalid Document' })
  }

  res.setPreviewData({}, {
    maxAge: 30,
  })
  
  res.writeHead(307, {
    Location: req.query.slug + '?tipePreview=true'
  })
  
  res.end()
}
  `
}
