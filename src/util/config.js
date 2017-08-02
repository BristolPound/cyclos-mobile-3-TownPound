import _ from 'lodash'
import * as Config from '@Config/config'


// the base configuration
export const global_default_config={
    APP_CITY: 'Scheme Area',
    APP_CURRENCY: 'Currency Name',
    APP_WEBSITE: 'https://github.com/ScottLogic/CityPoundSourceCode',
    TXT2PAY_NO: undefined,
    CYCLOS: {
        host: undefined,
        cyclosPrefix: undefined,
        network: undefined,
        wsPrefix: undefined,
        channel: undefined,
    },
    DIRECTORY: {
        host: undefined,
        cyclosPrefix: undefined,
        network: undefined,
        wsPrefix: undefined,
    },
    ALLOW_LOGIN: true,
    DEFAULT_COORDINATES: { latitude: 0, longitude:  0 },
}

const default_secret={
    CHANNEL_SECRET: '',
}

const secrets           = {}
const importedSecrets   = _.has(Config, 'secrets')
                        ? Config.secrets
                        : {}

_.forEach(['staging', 'development', 'production'], function(flavour) {

    const branch        = _.has(importedSecrets, flavour)
                        ? importedSecrets[flavour]
                        : {}

    _.defaultsDeep(branch, default_secret)

    secrets[flavour]    = branch
})

export const cyclosUrl = (config) => {
    config.CYCLOS.url = 'https://'+config.CYCLOS.host	+'/'+config.CYCLOS.cyclosPrefix +'/'+config.CYCLOS.network +'/api/'

    return config
}

const normaliseConfigurations = (configurations, flavour, default_config) => {

    const extendConfigurations = (c, f, cc) => {
        const result = {}

        // copy flavour config
        _.defaultsDeep(result, c)

        // copy default config
        _.defaultsDeep(result, default_config)

        // copy global default config
        _.defaultsDeep(result, global_default_config)

        cyclosUrl(result)

        result['secrets']   = _.has(secrets, flavour)
                            ? secrets[flavour]
                            : default_secret

        // save flavour
        result.FLAVOUR = f

        cc[f] = result
    }

    // extend the customisations
    _.each(configurations, extendConfigurations)

    const result    = _.has(configurations, flavour)
                    ? configurations[flavour]
                    : cyclosUrl(_.merge({}, default_config))

    if (result.CYCLOS.channel) {
        const channel = result.CYCLOS.channel.replace('{CHANNEL_SECRET}', result.secrets.CHANNEL_SECRET)
        console.log({'Channel': channel})
    }
    console.log(result)

    return result
}

_.merge(Config.default, normaliseConfigurations(Config.configurations, Config.flavour, Config.default_config))
