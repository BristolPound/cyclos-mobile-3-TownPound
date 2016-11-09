/**
 * Utility functions for handling address objects.
 * An address is expected to contain:
 *   addressLine1: string,
 *   addressLine2: string, (optional)
 *   zip: string
 *
 *   A full list of potentially available data can be found at:
 *   https://bristol.cyclos.org/bristolpoundsandbox03/api#!/Addresses/viewAddress
 */

function addressToString(address) {
  return [address.addressLine1, address.addressLine2, address.zip]
    .filter(a => a)
    .join(', ')
}

export default {
  toString: addressToString
}