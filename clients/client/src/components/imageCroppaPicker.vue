<template>
	<div
		class="component-container"
		v-bind:class="{ inputError: hasError && isDirty }"
		:style="'width: ' + componentWidth + 'px;'"
	>
		<div class="croppa-wrapper">
			<croppa
				v-model="croppa"
				:width="width"
				:height="height"
				:initial-image="initialImage"
				:show-remove-button="false"
				:zoom-speed="20"
				:accept="'image/*'"
				initial-size="contain"
				:placeholder="placeholder"
				:placeholder-font-size="placeholderFontSize"
				:prevent-white-space="false"
				:disable-drag-to-move="!enableMove"
				:disable-scroll-to-zoom="!enableZoom"
				@image-remove="deleteImage"
				@file-choose="selectImage"
				@move="updateImage"
				@zoom="updateImage"
				@file-type-mismatch="handleCroppaFileTypeMismatch"
				:disabled="disabled"
			>
			</croppa>
			<i
				v-if="!disabled"
				@click="croppa.remove()"
				class="material-icons delete-icon"
				>delete</i
			>
			<i
				v-if="disabled"
				@click="openImagePreview"
				class="material-icons open-in-new-icon"
				>open_in_new</i
			>
			<div v-if="loading" class="loading lds-dual-ring"></div>
			<div class="error-message-wrapper">
				<label class="error-message">{{ isDirty ? errorText : '' }}</label>
			</div>
		</div>
		<h4>{{ label }}</h4>
		<div class="buttons-container" v-if="!disabled">
			<button
				v-if="enableRotate"
				@click="
					rotateImage();
					$event.preventDefault();
				"
				tabindex="-1"
			>
				<i class="material-icons">rotate_right</i>
			</button>
			<button
				v-if="enableRotate"
				@click="
					rotateImage(-1);
					$event.preventDefault();
				"
				tabindex="-1"
			>
				<i class="material-icons">rotate_left</i>
			</button>
			<button
				v-if="enableZoom"
				@click="
					croppa.zoomIn();
					$event.preventDefault();
				"
				tabindex="-1"
			>
				<i class="material-icons">zoom_in</i>
			</button>
			<button
				v-if="enableZoom"
				@click="
					croppa.zoomOut();
					$event.preventDefault();
				"
				tabindex="-1"
			>
				<i class="material-icons">zoom_out</i>
			</button>
		</div>
		<image-preview
			v-if="showImagePreview"
			:imageId="value"
			@close="closeImagePreview"
		></image-preview>
	</div>
</template>

<style scoped>
/* Loading */
.loading {
	position: absolute;
}

.lds-dual-ring {
	display: inline-block;
	margin: 6px;
}
.lds-dual-ring:after {
	content: ' ';
	display: block;
	width: 30px;
	height: 30px;
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

.component-container {
	max-width: 200px;
	display:flex;
	margin:auto;
}

.component-container,
.croppa-wrapper {
	width: 100%;
	height: 100%;
	display: inline-flex;
	flex-direction: column;
	text-align: center;
	position: relative;
}

.component-container{
	max-width: 200px;
	min-width: 200px;
	display:flex;
	margin:auto;
}
.delete-icon,
.open-in-new-icon {
	display: inline-flex;
	position: absolute;
	border-radius: 50%;
	z-index: 10;
	cursor: pointer;
	top: 8px;
	right: 12px;
}

i.delete-icon:hover {
	color: var(--v-error-base, red);
}

i.delete-icon:hover,
i.open-in-new-icon:hover {
	color: var(--v-primary-base, blue);
}

.error-message-wrapper {
	position: absolute;
	bottom: 0;
	width: 100%;
}

.error-message {
	color: var(--v-error-base, red);
	font-weight: bold;
	text-shadow: -0.1px 0 black, 0 0.1px black, 0.1px 0 black, 0 -0.1px black;
	font-size: 20px;
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

.croppa-container {
	width: inherit;
	height: inherit;
	margin: auto;
	border: 2px dashed;
	border-color: #afafaf;
	border-radius: 5px;
	background-color: #fff;
}

.croppa-container >>> canvas {
	width: inherit !important;
	height: inherit !important;
}

.inputError {
	border-color: var(--v-error-base, red);
}

.buttons-container > button {
	width: 30px !important;
	height: 30px !important;
	border-radius: 25px;
	border: 1px solid;
	display: inline-flex;
	justify-content: center;
	text-align: center;
	margin: 5px;
}
</style>

<script>
import Validatable from '../mixins/validatable';
import SuperMethod from '../mixins/superMethod';

import ImagePreview from './modals/image-preview';
export default {
	mixins: [Validatable, SuperMethod],
	components: {
		ImagePreview
	},
	props: {
		form: Object,
		value: String,
		//
		disabled: Boolean,
		label: String,
		width: Number,
		height: Number,
		placeholder: String,
		'placeholder-font-size': Number,
		//
		'enable-zoom': Boolean,
		'enable-rotate': Boolean,
		'enable-move': Boolean
	},
	data() {
		return {
			mime: undefined,
			name: undefined,
			data: undefined,

			loading: false,
			uploadError: false,
			uploaded: true,

			previousRequest: undefined,
			timeout: undefined,

			croppa: undefined,
			initialImage: undefined,
			notInitialValue: true,

			showImagePreview: false
		};
	},
	methods: {
		openImagePreview() {
			if (this.disabled) {
				this.showImagePreview = true;
			}
		},
		closeImagePreview() {
			this.showImagePreview = false;
		},
		requestErrorHandler(error) {
			console.error(error);
			this.loading = false;
			this.uploadError = true;
			this.validate(true, this.internalValue);
		},
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
							self.isDirty = true;
							self.loading = false;
							self.uploaded = true;
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
		},
		debounceUpload(force = false) {
			let self = this;
			self.uploaded = false;
			clearTimeout(this.timeout);

			this.timeout = setTimeout(function() {
				self.timeout = null;
				if (self.loading && !force) {
					self.debounceUpload();
				} else {
					self.uploadFile();
				}
			}, 3500);
		},
		uploadFile() {
			let self = this;
			this.loading = true;
			this.uploadError = false;

			var formData = new FormData();
			formData.append('mime', this.mime);
			formData.append('data', this.data);
			formData.append('name', this.name);
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
							self.uploaded = true;
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
							self.uploaded = true;
						},
						(error) => {
							self.requestErrorHandler(error);
						}
					);
			}
		},
		deleteImage() {
			this.mime = null;
			this.data = null;
			this.name = null;
			this.uploaded = false;
			this.debounceUpload(true);
			this.$forceUpdate();
		},
		rotateImage(value) {
			this.croppa.rotate(value);
			this.$nextTick().then(() => {
				this.croppa.$nextTick().then(() => {
					setTimeout(() => {
						setTimeout(() => {
							this.croppa.moveLeftwards(1);
						}, 0);
						this.croppa.moveRightwards(1);
					}, 0);
				});
			});
		},
		selectImage(value) {
			this.name = value.name;
			this.uploaded = false;
		},
		updateImage(upload = true) {
			this.isDirty = true;
			var croppaImage = this.outputImageMethod();
			this.data = croppaImage.replace(/^data:([A-Za-z-+/]+);base64,/, '');
			this.mime = croppaImage.replace(/^data:|(;base64,.+)/g, '');
			if (upload) {
				this.debounceUpload();
			}
		},
		handleCroppaFileTypeMismatch(file) {
			this.valid = false;
			this.hasInput = this.hasFocused = true;
			this.errorBucket.push(`El archivo ${file.name} no es valido.`);
			this.errorMessages.push(`El archivo ${file.name} no es valido.`);
		},
		outputImageMethod() {
			return this.croppa.generateDataUrl();
		},
		injectNotUploadedRule(rules) {
			let notUploadedRule = (v) => v.uploaded || 'Imagen No Procesada';
			var haveNotUploadedRule = rules.find(
				(rule) => rule.name == notUploadedRule.name
			);
			if (!haveNotUploadedRule) rules.unshift(notUploadedRule);
		},
		injectLoadingRule(rules) {
			let loadingRule = (v) => !v.loading || 'Cargando Imagen';
			var haveLoadingRule = rules.find((rule) => rule.name == loadingRule.name);
			if (!haveLoadingRule) rules.unshift(loadingRule);
		},
		injectUploadErrorRule(rules) {
			let uploadErrorRule = (v) => !v.uploadError || 'Error en Cargar Imagen';
			var haveUploadErrorRule = rules.find(
				(rule) => rule.name == uploadErrorRule.name
			);

			if (!haveUploadErrorRule) rules.unshift(uploadErrorRule);
		},
		rulesWatcher(newVal, oldVal) {
			this.injectUploadErrorRule(newVal);
			this.injectNotUploadedRule(newVal);
			this.injectLoadingRule(newVal);

			this.super('rulesWatcher', 'validatable')(newVal, oldVal);
		}
	},
	mounted() {
		this.dataInit();

		this.injectUploadErrorRule(this.rules);

		this.injectNotUploadedRule(this.rules);

		this.injectLoadingRule(this.rules);

		this.croppa.$watch('imageSet', (value) => {
			if (value) {
				this.updateImage(!this.uploaded);
			}
		});
	},
	beforeDestroy() {
		clearTimeout(this.timeout);
		if (this.previousRequest) {
			this.previousRequest.abort();
		}
	},
	computed: {
		componentWidth() {
			return this.width + 20;
		},
		deleteIconTransformX() {
			return this.width - 15;
		},
		errorText() {
			return this.errorBucket[0];
		},
		imageSrc() {
			if (this.mime && this.data) {
				return `data:${this.mime};base64,${this.data}`;
			} else {
				return require('../assets/imagePickerDefault.png');
			}
		},
		internalValue() {
			if (this.croppa) {
				var value = {
					valid:
						!!this.mime &&
						!!this.data &&
						!!this.name &&
						!this.loading &&
						!this.uploadError &&
						this.uploaded,
					size: (4 * String(this.outputImageMethod()).length) / 3,
					type: this.mime,
					loading: this.loading,
					uploadError: this.uploadError,
					uploaded: this.uploaded
				};
				return value;
			}
			return {
				valid: false,
				size: 0,
				type: '',
				loading: this.loading,
				uploadError: this.uploadError,
				uploaded: this.uploaded
			};
		}
	},
	watch: {
		data(value) {
			this.isDirty = true;
			if (this.notInitialValue && value && value != null) {
				this.initialImage = this.imageSrc;
				this.croppa.refresh();
				this.notInitialValue = false;
			}
		},
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
