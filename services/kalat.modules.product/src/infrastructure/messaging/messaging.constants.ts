export const MESSAGING_SERVICE = 'Kalat.Modules.Product'
export const MESSAGING_VERSION = 'v1alpha'

export const DOMAIN_TOPIC = `${MESSAGING_SERVICE}.${MESSAGING_VERSION}.domain`
export const COMMAND_TOPIC = `${MESSAGING_SERVICE}.${MESSAGING_VERSION}.command`
export const QUERY_TOPIC = `${MESSAGING_SERVICE}.${MESSAGING_VERSION}.query`

export const PRODUCT_TOPIC = `${DOMAIN_TOPIC}.Product`
