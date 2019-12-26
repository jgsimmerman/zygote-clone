import fetch from 'isomorphic-fetch'

import { metaState, shippingState, productsState, totalsState, stepState, settingsState } from '../state'
import displayError from './display-error'
import displayInfo from './display-info'
import addTotalModification from './add-total-modification'
import addQuantityModification from './quantity-modifications'
import setShipping from './set-shipping'
import triggerEvent from './trigger-event'

export default async function fetchWebhook(path, body) {
	if (body.event) {
		triggerEvent(`${body.event}Attempt`, body)
	}
	let response, info, preFetchData
	try {
		info = {
			...body,
			products: productsState.state.products,
			selectedShippingMethod: shippingState.state.selected,
			totals: totalsState.state,
			meta: metaState.state.meta,
			subtotal: totalsState.state.subtotal,
		}

		preFetchData = info
		for (let i = 0; i < settingsState.state.plugins.length; i++) {
			preFetchData = await (body.event == `info` && typeof settingsState.state.plugins[i].preInfo === `function` ? settingsState.state.plugins[i].preInfo({ preFetchData, info }) : preFetchData)
			preFetchData = await (body.event == `order` && typeof settingsState.state.plugins[i].preOrder === `function` ? settingsState.state.plugins[i].preOrder({ preFetchData, info }) : preFetchData)
		}

		if (preFetchData.billingCardNumber) {
			preFetchData.billingCardNumber = preFetchData.billingCardNumber.replace(/\W+/g, ``)
		}

		const jsonBody = JSON.stringify(preFetchData)

		console.log(`Sending to API:`, jsonBody)
		if (path) {
			console.log(`Information sent to ${path}`)
			response = await fetch(path, {
				method: `post`,
				body: jsonBody,
			})
			response = await response.json()
		}
		else {
			console.warn(`No 'path' was provided for event '${body.event}'. Please fix this, unless the call is handled via a plugin.`)
			response = preFetchData
		}

		for (let i = 0; i < settingsState.state.plugins.length; i++) {
			response = await (body.event == `info` && typeof settingsState.state.plugins[i].coupons === `function` ? settingsState.state.plugins[i].coupons({ response, info, preFetchData }) : response)
			response = await (body.event == `info` && typeof settingsState.state.plugins[i].postInfo === `function` ? settingsState.state.plugins[i].postInfo({ response, info, preFetchData }) : response)
			response = await (body.event == `order` && typeof settingsState.state.plugins[i].postOrder === `function` ? settingsState.state.plugins[i].postOrder({ response, info, preFetchData }) : response)
		}
		console.log(`Received from API:`, response)
	}
	catch (err) {
		console.error(err)
		triggerEvent(`error`, err)
		response = {}
	}
	try {
		if (body.event) {
			const eventData = {
				...body,
				...response,
			}
			if (response.success === true) {
				triggerEvent(`${body.event}`, eventData)
			}
			else {
				triggerEvent(`error`, eventData)
			}
		}

		/////////////// SHIPPING METHODS ////////////////
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
		//////////////////// END SHIPPING METHODS ////////////////////////////////

		const {
			meta,
			messages,
			//shippingMethods,
			selectedShippingMethod = typeof shippingState.state.selected === `number`
				? shippingState.state.selected
				: 0,
			step,
			modifications,
			quantityModifications,
		} = response

		if (modifications) {
			addTotalModification(modifications)
		}
		if (quantityModifications) {
			response = { ...response, ...addQuantityModification(quantityModifications) }
		}
		if (typeof meta === `object`) {
			metaState.setState({ meta })
		}
		if (messages) {
			displayError(messages.error)
			displayInfo(messages.info)
		}
		if (shippingMethods) {
			shippingState.setState({
				methods: shippingMethods,
				selected: selectedShippingMethod,
			})
			if (typeof selectedShippingMethod == `object` && Object.keys(selectedShippingMethod).length > 0) {
				Object.keys(selectedShippingMethod).map(shipid => setShipping(selectedShippingMethod[shipid], shipid))
			}
			else {
				setShipping(selectedShippingMethod)
			}
		}
		else {
			for (let i = 0; i < settingsState.state.plugins.length; i++) {
				const ship = await (typeof settingsState.state.plugins[i].getShippingMethods === `function` ? settingsState.state.plugins[i].getShippingMethods({ response, info, preFetchData }) : {})
				if (ship && ship.methods && ship.methods.length) {
					shippingState.setState({
						methods: ship.methods,
						selected: ship.selected ? ship.selected : selectedShippingMethod,
					})
					if (ship.selected) {
						setShipping(ship.selected)
					}
				}
			}
		}
		if (step) {
			stepState.setState({ step })
		}
	}
	catch (err) {
		console.error(err)
	}

	return response
}