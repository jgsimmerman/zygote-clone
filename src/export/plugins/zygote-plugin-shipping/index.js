import React, { Fragment } from 'react'
import { fetchWebhook } from '../../export/utils/fetch'

const getShippingMethods = async ({ response, info, preFetchData }) => {

	let shippingMethods = []

	let shippingOptions = [
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
			addInfo: ``,
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
			addInfo: ``,
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
			addInfo: ``,
		},
		{
			id: `ship-3`,
			description: `Free Shipping`,
			value: () => {
				if (info.totals.subtotal > 4999) {
					return 0
				} else return `Spend $75 or more to unlock free shipping!`
			},
			addInfo: ``,
		},
	]

	shippingMethods = shippingOptions.map(option => (
		{
			id: option.id,
			description: option.label,
			value: option.value,
			addInfo: `Get it ${option.eta}!`,
		}
	))

	return {
		...response,
		shippingMethods: shippingMethods,
		selectedShippingMethod: shippingMethods[0], // Default selected one
	}
};

export { getShippingMethods }
