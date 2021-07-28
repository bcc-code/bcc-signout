import { ClientConfiguration } from '../interfaces/clientConfiguration.interface'

var fs = require('fs')

class ClientConfigurationService {
    readClientConfig(clientId: string): [string, string[]] {
        const configPath = process.env.ENVIRONMENT === "TEST" ? './test/setup/testData.json' : './data/clientConfig.json'
        const appsData = JSON.parse(fs.readFileSync(configPath, 'utf8')
        ) as ClientConfiguration[]
        const clientData = appsData.find(
            (client: any) => client.clientId === clientId
        )

        if (clientData === undefined) {
            return ['', []]
        }

        return [clientData.method, clientData.callbackUrls]
    }
}

export default new ClientConfigurationService()
