import { ClientConfiguration } from '../interfaces/clientConfiguration.interface'

var fs = require('fs')

class ClientConfigurationService {
    readClientConfig(clientId: string): string[] {
        const appsData = JSON.parse(
            fs.readFileSync('./data/clientConfig.json', 'utf8')
        ) as ClientConfiguration[]
        const clientData = appsData.find(
            (client: any) => client.clientId === clientId
        )

        if (clientData === undefined) {
            return []
        }

        return clientData.callbackUrls
    }
}

export default new ClientConfigurationService()
