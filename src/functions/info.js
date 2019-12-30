export async function handler({ body }) {

	console.log(`Received from client:`, JSON.parse(body))

	const response = {
		success: true,
		modifications: [
			{
				id: `january-sale`,
				description: `January Sale`,
				value: -2000,
			},
			{
				id: `tax`,
				description: `Sales Tax`,
				value: 899,
			},
		],
		shippingMethods: [
			{
				id: `ship0`,
				
			},
			{
				id: `ship1`,
		
			},
			{
				id: `ship2`,
			
			},
		],
		selectedShippingMethod: `ship0`,
		quantityModifications: [
			{
				id: `TESTA`,
				available: `5`,
			},
			{
				id: `TESTB`,
				available: `2`,
			},
		],
	}

	// Response
	return {
		statusCode: 200,
		body: JSON.stringify(response),
	}
}