<template>
	<div>
		<v-dialog v-model="dialog" max-width="700" scrollable>
			<v-card>
				<v-container fluid>
					<v-layout row wrap>
						<v-flex d-flex>
							<v-card flat tile class="d-flex">
								<v-img :src="data" contain aspect-ratio="1">
									<v-layout
										slot="placeholder"
										fill-height
										align-center
										justify-center
										ma-0
									>
										<v-progress-circular
											v-if="loading"
											class="loader"
											indeterminate
											color="grey lighten-5"
										></v-progress-circular>
									</v-layout>
								</v-img>
							</v-card>
						</v-flex>
					</v-layout>
				</v-container>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { events } from '../../main';

export default {
	props: ['imageId'],
	data() {
		return {
			data: '',
			loading: false,
			dialog: true
		};
	},
	methods: {
		snackbar: function(message) {
			events.$emit('snackbar', message);
		},
		dataInit() {
			this.loading = true;
			this.$http
				.get(`fileStorage/image/${this.imageId}`)
				.then(
					(response) => {
						this.data = response.body.data;
					},
					(error) => {
						this.snackbar('Hubo un problema al obtener la imagen.');
						this.$emit('close');
					}
				)
				.finally(() => {
					this.loading = false;
				});
		}
	},
	watch: {
		dialog(val) {
			!val && this.$emit('close');
		}
	},
	mounted() {
		this.dataInit();
	}
};
</script>

<style scoped>
.loader {
	height: 320px !important;
	width: 320px !important;
	color: inherit !important;
}
</style>
