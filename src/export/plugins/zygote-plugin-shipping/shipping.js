import React, { Fragment } from 'react'
import { fetchWebhook } from '../../export/utils/fetch'
import messagesState from '../state/status-messages'


const getShippingMethods = async ({ response, info, preFetchData }) => {

	//let subtotal = info.totals.subtotal
	let subtotal = info.subtotal
	let shippingMethods = []

	let shippingOptions = [
		{
			id: `ship0`,
			description: `Standard Shipping`,
			value: (subtotal) => {
				if (subtotal < 3000) {
					return 795
				} else if (subtotal < 4500) {
					return 895
				}
				else if (subtotal < 6000) {
					return 995
				}
				else if (subtotal <= 7500) {
					return 1195
				}
				else if (subtotal > 7501) {
					return 0
				}
			},
			addInfo:  `Free standard shipping on orders over $75!`,
		},
		{
			id: `ship1`,
			description: `Express Shipping`,
			value: (subtotal) => {
				if (subtotal < 3000) {
					return 1595
				} else if (subtotal < 4500) {
					return 1795
				} else if (subtotal < 6000) {
					return 1895
				}
				else if (subtotal < 7500) {
					return 2195
				}
				else if (subtotal < 10500) {
					return 3095
				}
				else if (subtotal < 14000) {
					return 3395
				}
				else if (subtotal < 17500) {
					return 4195
				}
				else if (subtotal < 21000) {
					return 4795
				}
				else if (subtotal < 35000) {
					return 5495
				}
				else if (subtotal < 50000) {
					return 6796
				}
				else if (subtotal < 75000) {
					return 7995
				}
				else if (subtotal <= 100000) {
					return 9695
				}
				else if (subtotal > 100000) {
					return 9695
				}
			},
			addInfo: ``,
		},
		{
			id: `ship2`,
			description: `Overnight Shipping`,
			value: (subtotal) => {
				if (subtotal < 3000) {
					return 2995
				} else if (subtotal < 4500) {
					return 3295
				} else if (subtotal < 6000) {
					return 3495
				}
				else if (subtotal < 7500) {
					return 3995
				}
				else if (subtotal < 10500) {
					return 5695
				}
				else if (subtotal < 14000) {
					return 5995
				}
				else if (subtotal < 17500) {
					return 7195
				}
				else if (subtotal < 21000) {
					return 8195
				}
				else if (subtotal < 35000) {
					return 8995
				}
				else if (subtotal < 50000) {
					return 10995
				}
				else if (subtotal < 75000) {
					return 12595
				}
				else if (subtotal <= 100000) {
					return 14995
				}
				else if (subtotal > 100000) {
					return 16995
				}
			},
			addInfo: ``,
		},
		// {
		// 	id: `ship3`,
		// 	description: `Free Shipping`,
		// 	value: (subtotal) => {
		// 		if (subtotal > 7499) {
		// 			return 0
		// 		} else return `Ineligible`
		// 	},
		// 	addInfo: `Free standard shipping on orders over $75!`,
		// },
	]

	shippingMethods = shippingOptions.map(option => (
		{
			id: option.id,
			description: option.description,
			value: option.value(subtotal),
			addInfo: `${option.addInfo}`,
		}
	))

	return {
		...response,
		shippingMethods: shippingMethods,
		selectedShippingMethod: shippingMethods[0], // Default selected one
	}
}

export { getShippingMethods }
