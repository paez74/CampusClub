<template>
	<div>
		<div class="loading lds-dual-ring" v-if="loading"></div>
		<v-icon v-if="!imageSrc && !loading">person</v-icon>
		<img class="user-image" v-if="imageSrc && !loading" :src="imageSrc" />
	</div>
</template>

<style scoped>
/* Loading */
.loading {
	margin-left: 10px;
}
.lds-dual-ring {
	display: inline-block;
}
.lds-dual-ring:after {
	content: ' ';
	display: block;
	width: 35px;
	height: 35px;
	margin: 1px;
	border-radius: 50%;
	border: 2px solid #fff;
	border-color: #000000 transparent #000000 transparent;
	animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.user-image {
	width: 35px;
	height: 35px;
	margin-left: 10px;
	border-radius: 25px;
}
</style>

<script>
export default {
	mixins: [],
	props: {
		value: String
	},
	data() {
		return {
			mime: undefined,
			name: undefined,
			data: undefined,

			loading: false,

			previousRequest: undefined
		};
	},
	methods: {
		dataInit() {
			this.getFileFromServer();
		},
		getFileFromServer() {
			if (this.value) {
				let self = this;
				this.loading = true;
				this.$http
					.get('fileStorage/' + this.value, {
						before(request) {
							// abort previous request, if exists
							if (this.previousRequest) {
								this.previousRequest.abort();
							}
							// set previous request on Vue instance
							this.previousRequest = request;
						}
					})
					.then(
						(response) => {
							self.loading = false;
							self.mime = response.body.data.mime;
							self.data = response.body.data.data;
							self.name = response.body.data.name;
							self.$forceUpdate();
						},
						(error) => {
							self.requestErrorHandler(
								error.message || 'Error al obtener archivo'
							);
						}
					);
			}
		}
	},
	mounted() {
		this.dataInit();
	},
	computed: {
		imageSrc() {
			if (this.mime && this.data) {
				return `data:${this.mime};base64,${this.data}`;
			} else {
				return undefined;
			}
		}
	},
	watch: {
		value: {
			handler(newVal, oldVal) {
				if (newVal != oldVal) {
					this.getFileFromServer();
				}
			}
		}
	}
};
</script>
