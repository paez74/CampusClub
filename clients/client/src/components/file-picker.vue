<template>
	<div v-bind:class="{ inputError: hasError && isDirty }">
		<div>
			<input
				type="file"
				style="display: none"
				ref="file"
				@change="onFilePicked"
			/>
			<h3 style="margin-bottom: 5px;">{{ label }}</h3>
			<v-badge overlap color="error">
				<span slot="badge" v-if="isDirty && hasError">!</span>
				<v-avatar
					class="cursor-pointer"
					color="primary"
					@click="pickFile"
					v-if="!disabled"
				>
					<v-icon dark v-if="!loading">cloud_upload</v-icon>
					<v-progress-circular
						v-if="loading"
						indeterminate
						color="secondary"
					></v-progress-circular>
				</v-avatar>
			</v-badge>
			<v-avatar
				class="cursor-pointer"
				color="primary"
				@click="downloadFile"
				v-if="disabled"
			>
				<v-progress-circular
					v-if="loading"
					indeterminate
					color="secondary"
				></v-progress-circular>
				<v-icon dark v-if="!loading">cloud_download</v-icon>
			</v-avatar>
			<label v-if="!disabled || (disabled && name)">
				{{ name ? 'Nombre: ' : ''
				}}<i>{{ name ? name : 'Ningún archivo seleccionado' }}</i>
			</label>
		</div>
		<span v-if="isDirty && hasError" class="tooltiptext">{{ errorText }}</span>
	</div>
</template>

<style scoped>
/* Tooltip text */
div.inputError .tooltiptext {
	visibility: hidden;
	position: absolute;
	max-width: 120px;
	min-width: 120px;
	background-color: #555;
	color: #fff;
	text-align: center;
	padding: 5px 0;
	border-radius: 5px;
	z-index: 1;
	opacity: 0;
	margin-top: 8px;
	transform: translate(0px, -30px);
}

div.inputError .tooltiptext {
	-webkit-transition: all 0.5s ease 0s;
	-moz-transition: all 0.5s ease 0s;
	-o-transition: all 0.5s ease 0s;
	transition: all 0.5s ease 0s;
}

/* Show the tooltip text when you mouse over the tooltip container */
div.inputError:hover .tooltiptext {
	visibility: visible;
	opacity: 1;
	transform: translate(0px, 0px);
}
</style>

<script>
import { _ } from 'underscore';
import moment from 'moment-timezone';
import Validatable from '../mixins/validatable';
import SuperMethod from '../mixins/superMethod';

export default {
	mixins: [Validatable, SuperMethod],
	props: {
		value: String,
		label: String,
		disabled: Boolean
	},
	components: {},
	data() {
		return {
			loading: false,
			uploadError: false,

			previousRequest: undefined,

			mime: undefined,
			data: undefined,
			name: undefined,

			userId: localStorage.getItem('userId')
		};
	},
	methods: {
		requestErrorHandler(error) {
			console.error(error);
			this.loading = false;
			this.uploadError = true;
			this.validate(true, this.internalValue);
		},
		dataInit() {
			this.getInfoFromServer();
		},
		getInfoFromServer() {
			if (this.value) {
				let self = this;
				this.loading = true;
				this.$http.get('fileStorage/info/' + this.value).then(
					(response) => {
						self.isDirty = true;
						self.loading = false;
						self.mime = response.body.data.mime;
						self.name = response.body.data.name;
					},
					(error) => {
						self.printError(error.message || 'Error al obtener archivo');
					}
				);
			}
		},
		getFileFromServer(download = false) {
			if (this.value) {
				let self = this;
				this.loading = true;
				this.$http.get('fileStorage/' + this.value).then(
					(response) => {
						self.isDirty = true;
						self.loading = false;
						self.mime = response.body.data.mime;
						self.data = response.body.data.data;
						self.name = response.body.data.name;
						if (download) {
							self.auxiliarDownloadFile();
						}
					},
					(error) => {
						self.printError(error.message || 'Error al obtener archivo');
					}
				);
			}
		},
		transformBase64Data(e) {
			var self = this;
			const files = e.target.files;
			if (files[0] !== undefined) {
				self.loading = true;
				const fr = new FileReader();
				fr.readAsDataURL(files[0]);
				fr.addEventListener('load', () => {
					const data = fr.result.replace(/^data:([A-Za-z-+/]+);base64,/, '');
					const mime = fr.result.replace(/^data:|(;base64,.+)/g, '');
					const name = files[0].name;
					self.mime = mime;
					self.data = data;
					self.name = name;
					var formData = new FormData();
					formData.append('mime', mime);
					formData.append('data', data);
					formData.append('name', name);
					self.uploadFile(formData);
				});
			}
		},
		auxiliarDownloadFile() {
			var link = document.createElement('a');
			link.download = this.name;
			link.href = `data:${this.mime};base64,${this.data}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		pickFile() {
			if (!this.loading) {
				this.isDirty = true;
				this.$refs.file.click();
			}
		},
		onFilePicked(e) {
			this.transformBase64Data(e);
		},
		downloadFile() {
			if (this.loading) return;
			if (this.internalValue.valid) {
				this.auxiliarDownloadFile();
			} else {
				this.getFileFromServer(true);
			}
		},
		uploadFile(formData) {
			let self = this;
			this.uploadError = false;
			formData.append('updatedById', this.userId);
			if (!this.value) {
				formData.append('createdById', this.userId);
				this.$http
					.post('fileStorage/', formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						},
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
							self.$emit('input', response.body.data.id);
							self.loading = false;
						},
						(error) => {
							self.requestErrorHandler(error);
						}
					);
			} else {
				this.$http
					.put('fileStorage/' + this.value, formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						},
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
							self.$emit('input', response.body.data.id);
							self.loading = false;
						},
						(error) => {
							self.requestErrorHandler(error);
						}
					);
			}
		},
		injectLoadingRule(rules) {
			let loadingRule = (v) => !v.loading || 'Cargando Archivo';
			var haveLoadingRule = rules.find((rule) => rule.name == loadingRule.name);
			if (!haveLoadingRule) rules.unshift(loadingRule);
		},
		injectUploadErrorRule(rules) {
			let uploadErrorRule = (v) => !v.uploadError || 'Error en Cargar Archivo';
			var haveUploadErrorRule = rules.find(
				(rule) => rule.name == uploadErrorRule.name
			);

			if (!haveUploadErrorRule) rules.unshift(uploadErrorRule);
		},
		rulesWatcher(newVal, oldVal) {
			this.injectUploadErrorRule(newVal);
			this.injectLoadingRule(newVal);

			this.super('rulesWatcher', 'validatable')(newVal, oldVal);
		}
	},
	mounted() {
		this.dataInit();

		this.injectUploadErrorRule(this.rules);

		this.injectLoadingRule(this.rules);
	},
	beforeDestroy() {
		if (this.previousRequest) {
			this.previousRequest.abort();
		}
	},
	filters: {},
	computed: {
		src() {
			if (!this.mime || !this.data) {
				return '';
			}
			return `data:${this.mime};base64,${this.data}`;
		},
		internalValue() {
			var value = {
				loading: this.loading,
				uploadError: this.uploadError,
				valid:
					!!this.mime &&
					!!this.data &&
					!!this.name &&
					!!this.value &&
					!this.uploadError,
				size: (4 * this.src.length) / 3,
				type: this.mime
			};
			return value;
		}
	},
	watch: {
		value: {
			handler(newVal, oldVal) {
				if (newVal != oldVal) {
					this.getInfoFromServer();
				}
			}
		}
	}
};
</script>
