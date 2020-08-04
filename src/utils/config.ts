import Conf from 'conf'
import pjson from '../../package.json'

const config = new Conf({
  projectName: 'tipe-cli',
  projectVersion: pjson.version,
})

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
