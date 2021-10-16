export interface NWStatusResponse {
	data: {
		message: {
			worlds: [
				{
					name: string,
					type: string,
					serialized_type: string,
					identifier: string
				}
			]
		}
	}
}
