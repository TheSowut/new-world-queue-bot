export interface NWStatusResponse {
	data: {
		message: {
			players_current: number,
			players_maximum: number,
			queue_current: number,
			queue_wait_time_minutes: number,
			status_enum: string
		}
	}
}
