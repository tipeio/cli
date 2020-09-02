"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewRouteTemplate = exports.pageTemplate = exports.fieldsTemplate = exports.schemaTemplate = void 0;

/**
 * Create your schema here
 */
const schemaTemplate = {
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
  `
};
exports.schemaTemplate = schemaTemplate;
const fieldsTemplate = {
  deps: [],
  string: `module.exports = {
    // Add any custom fields here
  }`
};
exports.fieldsTemplate = fieldsTemplate;

const pageTemplate = (page, options) => {
  return `
  /** @jsx jsx */
  import { jsx } from 'theme-ui'
  import React from 'react'
  import Head from 'next/head'
  import { ${page}, WithTipePage, typography } from '@tipe/react-editor'
  import Link from 'next/link'
  import Router from 'next/router'
  import createTipeClient from '@tipe/js'
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
    previewSecret: process.env.TIPE_PREVIEW_SECRET,
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
`;
};

exports.pageTemplate = pageTemplate;

const previewRouteTemplate = () => {
  return `import createTipeClient from '@tipe/js'

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

  if( req.query.secret !== process.env.TIPE_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  const document = await tipe.getDocument({id: req.query.id, draft: true})

  if (!document) {
    return res.status(401).json({ message: 'Invalid Document' })
  }

  res.setPreviewData({}, {
    maxAge: 1,
  })
  
  res.writeHead(307, {
    Location: req.query.slug + '?tipePreview=true'
  })
  
  res.end()
}
  `;
};

exports.previewRouteTemplate = previewRouteTemplate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy90ZW1wbGF0ZXMudHMiXSwibmFtZXMiOlsic2NoZW1hVGVtcGxhdGUiLCJkZXBzIiwic3RyaW5nIiwiZmllbGRzVGVtcGxhdGUiLCJwYWdlVGVtcGxhdGUiLCJwYWdlIiwib3B0aW9ucyIsInNjaGVtYVBhdGgiLCJjdXN0b21GaWVsZHNQYXRoIiwiZW52aXJvbm1lbnQiLCJwcm9qZWN0SWQiLCJhZG1pbkhvc3QiLCJjb250ZW50SG9zdCIsImFzc2V0SG9zdCIsIm1vdW50UGF0aCIsInByZXZpZXdSb3V0ZVRlbXBsYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7OztBQUdPLE1BQU1BLGNBQWMsR0FBRztBQUM1QkMsRUFBQUEsSUFBSSxFQUFFLENBQUMsVUFBRCxDQURzQjtBQUU1QkMsRUFBQUEsTUFBTSxFQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGbUIsQ0FBdkI7O0FBeUJBLE1BQU1DLGNBQW1CLEdBQUc7QUFDakNGLEVBQUFBLElBQUksRUFBRSxFQUQyQjtBQUVqQ0MsRUFBQUEsTUFBTSxFQUFHOzs7QUFGd0IsQ0FBNUI7OztBQU9BLE1BQU1FLFlBQVksR0FBRyxDQUFDQyxJQUFELEVBQWVDLE9BQWYsS0FBbUM7QUFDN0QsU0FBUTs7Ozs7YUFLR0QsSUFBSzs7Ozs7MEJBS1FDLE9BQU8sQ0FBQ0MsVUFBVztnQ0FDYkQsT0FBTyxDQUFDRSxnQkFBaUI7Ozs7Ozs7Ozs7O29CQVdyQ0YsT0FBTyxDQUFDRyxXQUFZO2tCQUN0QkgsT0FBTyxDQUFDSSxTQUFVOztrQkFFbEJKLE9BQU8sQ0FBQ0ssU0FBUixJQUFxQixFQUFHO29CQUN0QkwsT0FBTyxDQUFDTSxXQUFSLElBQXVCLEVBQUc7a0JBQzVCTixPQUFPLENBQUNPLFNBQVIsSUFBcUIsRUFBRzs7OzhCQUdaUixJQUFLOzs7O2tCQUlqQkMsT0FBTyxDQUFDUSxTQUFVO2dCQUNwQlIsT0FBTyxDQUFDSSxTQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FuQ2hDO0FBK0RELENBaEVNOzs7O0FBa0VBLE1BQU1LLG9CQUFvQixHQUFHLE1BQWM7QUFDaEQsU0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBQVI7QUF3Q0QsQ0F6Q00iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZSB5b3VyIHNjaGVtYSBoZXJlXG4gKi9cbmV4cG9ydCBjb25zdCBzY2hlbWFUZW1wbGF0ZSA9IHtcbiAgZGVwczogWydAdGlwZS9qcyddLFxuICBzdHJpbmc6IGBjb25zdCB7IGNyZWF0ZVNjaGVtYSB9ID0gcmVxdWlyZSgnQHRpcGUvanMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVNjaGVtYShbXG4gIC8qKlxuICAgKiBNb2RpZnkgYW5kIGFkZCB5b3VyIHNjaGVtYSBoZXJlXG4gICAqICovXG4gIHtcbiAgICBpZDogJ2hvbWVQYWdlJyxcbiAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgIGxhYmVsOiAnSG9tZSBQYWdlJyxcbiAgICBwcmV2aWV3UGF0aDogJy8nLFxuICAgIGZpZWxkczogW1xuICAgICAge1xuICAgICAgICBpZDogJ3RpdGxlJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgIGxhYmVsOiAnVGl0bGUnXG4gICAgICB9XG4gICAgXVxuICB9LFxuXSlcbiAgYCxcbn1cblxuZXhwb3J0IGNvbnN0IGZpZWxkc1RlbXBsYXRlOiBhbnkgPSB7XG4gIGRlcHM6IFtdLFxuICBzdHJpbmc6IGBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBBZGQgYW55IGN1c3RvbSBmaWVsZHMgaGVyZVxuICB9YCxcbn1cblxuZXhwb3J0IGNvbnN0IHBhZ2VUZW1wbGF0ZSA9IChwYWdlOiBzdHJpbmcsIG9wdGlvbnMpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gYFxuICAvKiogQGpzeCBqc3ggKi9cbiAgaW1wb3J0IHsganN4IH0gZnJvbSAndGhlbWUtdWknXG4gIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbiAgaW1wb3J0IEhlYWQgZnJvbSAnbmV4dC9oZWFkJ1xuICBpbXBvcnQgeyAke3BhZ2V9LCBXaXRoVGlwZVBhZ2UsIHR5cG9ncmFwaHkgfSBmcm9tICdAdGlwZS9yZWFjdC1lZGl0b3InXG4gIGltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluaydcbiAgaW1wb3J0IFJvdXRlciBmcm9tICduZXh0L3JvdXRlcidcbiAgaW1wb3J0IGNyZWF0ZVRpcGVDbGllbnQgZnJvbSAnQHRpcGUvanMnXG4gIGltcG9ydCB7IFR5cG9ncmFwaHlTdHlsZSB9IGZyb20gJ3JlYWN0LXR5cG9ncmFwaHknXG4gIGxldCBzY2hlbWEgPSByZXF1aXJlKCcke29wdGlvbnMuc2NoZW1hUGF0aH0nKVxuICBsZXQgY3VzdG9tRmllbGRzID0gcmVxdWlyZSgnJHtvcHRpb25zLmN1c3RvbUZpZWxkc1BhdGh9JylcblxuICBpZiAoY3VzdG9tRmllbGRzLmRlZmF1bHQpIHtcbiAgICBjdXN0b21GaWVsZHMgPSBjdXN0b21GaWVsZHMuZGVmYXVsdFxuICB9XG5cbiAgaWYgKHNjaGVtYS5kZWZhdWx0KSB7XG4gICAgc2NoZW1hID0gc2NoZW1hLmRlZmF1bHRcbiAgfVxuICBcbiAgY29uc3QgY2xpZW50ID0gY3JlYXRlVGlwZUNsaWVudCh7XG4gICAgZW52aXJvbm1lbnQ6ICcke29wdGlvbnMuZW52aXJvbm1lbnR9JyxcbiAgICBwcm9qZWN0SWQ6ICcke29wdGlvbnMucHJvamVjdElkfScsXG4gICAga2V5OiBwcm9jZXNzLmVudi5USVBFX0FQSV9LRVksXG4gICAgYWRtaW5Ib3N0OiAnJHtvcHRpb25zLmFkbWluSG9zdCB8fCAnJ30nLFxuICAgIGNvbnRlbnRIb3N0OiAnJHtvcHRpb25zLmNvbnRlbnRIb3N0IHx8ICcnfScsXG4gICAgYXNzZXRIb3N0OiAnJHtvcHRpb25zLmFzc2V0SG9zdCB8fCAnJ30nXG4gIH0pXG4gIFxuICBjb25zdCBQYWdlID0gV2l0aFRpcGVQYWdlKCR7cGFnZX0sIHtcbiAgICBjbGllbnQsXG4gICAgc2NoZW1hLFxuICAgIGN1c3RvbUZpZWxkcyxcbiAgICBtb3VudFBhdGg6ICcke29wdGlvbnMubW91bnRQYXRofScsXG4gICAgcHJvamVjdDogJyR7b3B0aW9ucy5wcm9qZWN0SWR9JyxcbiAgICBwcmV2aWV3U2VjcmV0OiBwcm9jZXNzLmVudi5USVBFX1BSRVZJRVdfU0VDUkVULFxuICAgIGNvbnRlbnRIb3N0OiBjbGllbnQuX19jb25maWcuY29udGVudEhvc3QsXG4gICAgYXNzZXRIb3N0OiBjbGllbnQuX19jb25maWcuYXNzZXRIb3N0LFxuICAgIGFkbWluSG9zdDogY2xpZW50Ll9fY29uZmlnLmFkbWluSG9zdCxcbiAgICBMaW5rOiAoeyB0bywgY2hpbGRyZW4sIHN0eWxlcyB9KSA9PiAoXG4gICAgICA8TGluayBocmVmPXt0b30gcGFzc0hyZWY+XG4gICAgICAgIDxhIHN4PXtzdHlsZXN9PntjaGlsZHJlbn08L2E+XG4gICAgICA8L0xpbms+XG4gICAgKSxcbiAgICBvbk5hdmlnYXRlOiAodG8pID0+IHtcbiAgICAgIGxldCBwYXRoID0gdG9cbiAgICAgIGlmIChwYXRoWzBdICE9PSAnLycpIHtcbiAgICAgICAgcGF0aCA9ICcvJyArIHBhdGhcbiAgICAgIH1cbiAgICAgIFJvdXRlci5wdXNoKHBhdGgpXG4gICAgfSxcbiAgfSlcblxuICBleHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxUeXBvZ3JhcGh5U3R5bGUgdHlwb2dyYXBoeT17dHlwb2dyYXBoeX0gLz5cbiAgICAgICAgPFBhZ2UgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuYFxufVxuXG5leHBvcnQgY29uc3QgcHJldmlld1JvdXRlVGVtcGxhdGUgPSAoKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGBpbXBvcnQgY3JlYXRlVGlwZUNsaWVudCBmcm9tICdAdGlwZS9qcydcblxuY29uc3QgY2xpZW50T3B0aW9ucyA9IHtcbiAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5USVBFX1BST0pFQ1RfSUQsXG4gIGVudmlyb25tZW50OiBwcm9jZXNzLmVudi5USVBFX0VOVklST05NRU5ULFxuICBhc3NldEhvc3Q6IHByb2Nlc3MuZW52LlRJUEVfQVNTRVRfSE9TVCB8fCAnJyxcbiAgY29udGVudEhvc3Q6IHByb2Nlc3MuZW52LlRJUEVfQ09OVEVOVF9IT1NUIHx8ICcnLFxuICBhZG1pbkhvc3Q6IHByb2Nlc3MuZW52LlRJUEVfQURNSU5fSE9TVCB8fCAnJyxcbiAga2V5OiBwcm9jZXNzLmVudi5USVBFX0FQSV9LRVkgfHwgJycsXG59XG5cbmNvbnN0IHRpcGUgPSBjcmVhdGVUaXBlQ2xpZW50KGNsaWVudE9wdGlvbnMpXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICBcbiAgaWYgKCAhcmVxLnF1ZXJ5LnNsdWcgfHwgIXJlcS5xdWVyeS5pZCkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IG1lc3NhZ2U6ICdJbnZhbGlkIHRva2VuJyB9KVxuICB9XG5cbiAgaWYoIHJlcS5xdWVyeS5zZWNyZXQgIT09IHByb2Nlc3MuZW52LlRJUEVfUFJFVklFV19TRUNSRVQpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oeyBtZXNzYWdlOiAnSW52YWxpZCBzZWNyZXQnIH0pXG4gIH1cblxuICBjb25zdCBkb2N1bWVudCA9IGF3YWl0IHRpcGUuZ2V0RG9jdW1lbnQoe2lkOiByZXEucXVlcnkuaWQsIGRyYWZ0OiB0cnVlfSlcblxuICBpZiAoIWRvY3VtZW50KSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgbWVzc2FnZTogJ0ludmFsaWQgRG9jdW1lbnQnIH0pXG4gIH1cblxuICByZXMuc2V0UHJldmlld0RhdGEoe30sIHtcbiAgICBtYXhBZ2U6IDEsXG4gIH0pXG4gIFxuICByZXMud3JpdGVIZWFkKDMwNywge1xuICAgIExvY2F0aW9uOiByZXEucXVlcnkuc2x1ZyArICc/dGlwZVByZXZpZXc9dHJ1ZSdcbiAgfSlcbiAgXG4gIHJlcy5lbmQoKVxufVxuICBgXG59XG4iXX0=