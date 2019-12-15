declare module 'download-git-repo' {
  interface ErrorCallback {
    (err: Error): void
  }

  interface Download {
    (repo: string, destination: string, options: Record<string, any>, callback: ErrorCallback): void
    (repo: string, destination: string, callback: ErrorCallback): void
  }

  const download: Download
  export default download
}
