import React, { Fragment } from 'react'
import { fetchWebhook } from '../../export/utils/fetch'

const getShippingMethods = async ({ response, info, preFetchData }) => {
	// const shipping = {
	// 	destination: {
	// 		street1: info.shippingAddress1,
	// 		street2: info.shippingAddress2,
	// 		city: info.shippingCity,
	// 		state: info.shippingStateAbbr,
	// 		zip: info.shippingZip,
	// 		country: `US`,

	// 		company: info.shippingCompany || ``,
	// 		phone: info.infoPhone || ``,
	// 	},
	// 	products: response.products,
	// }

	let shippingMethods = [
		{
			id: `ship-0`,
			description: `Standard Shipping`,
			value: () => {
				if (info.totals.subtotal < 3001) {
					return 795
				} else if (info.totals.subtotal < 4501) {
					return 895
				} else if (info.totals.subtotal < 6001) {
					return 995
				}
			},
		},
		{
			id: `ship-1`,
			description: `Express Shipping`,
			value: () => {
				if (info.totals.subtotal < 3001) {
					return 1595
				} else if (info.totals.subtotal < 4501) {
					return 1795
				} else if (info.totals.subtotal < 6001) {
					return 1895
				}
			},
		},
		{
			id: `ship-2`,
			description: `Overnight Shipping`,
			value: () => {
				if (info.totals.subtotal < 3001) {
					return 2995
				} else if (info.totals.subtotal < 4501) {
					return 3295
				} else if (info.totals.subtotal < 6001) {
					return 3495
				}
			},
		},
		{
			id: `ship-3`,
			description: `Free Shipping`,
			value: () => {
				if (info.totals.subtotal > 4999) {
					return 0
				} else return `Spend $50 or more to unlock free shipping!`
			},
		},
	]

	return {
		...response,
		shippingMethods: shippingMethods,
		selectedShippingMethod: shippingMethods[0], // Default selected one
	}
};

export { getShippingMethods }
