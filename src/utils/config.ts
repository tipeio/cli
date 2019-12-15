import Conf from 'conf'

const config = new Conf()

export default {
  getAuth(): string {
    return config.get('tipe.auth')
  },
  setAuth(token: string): void {
    config.set('tipe.auth', token)
  },
  removeAuth(): void {
    config.delete('tipe.auth')
  },
}
