import _ from 'lodash'

export const normaliseConfigurations = (configurations, flavour, default_config) => {

    const extendConfigurations = (c, f, cc) => {
        const result = {}

        // copy default config
        _.merge(result, default_config)

        // copy default config
        _.merge(result, c)

        // save flavour
        result.FLAVOUR = f

        cc[f] = result
    }

    // extend the customisations
    _.each(configurations, extendConfigurations)

    return  ( _.has(configurations, flavour)
            ? configurations[flavour]
            : default_config
            )
}
