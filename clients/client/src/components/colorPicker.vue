<template>
	<div class="field" v-bind:class="{ inputError: hasError && isDirty }">
		<div class="label">
			{{ label }}
		</div>
		<div class="input">
			<swatches
				@close="onSwatchesClose"
				v-bind:value="value"
				v-on:input="updateValue"
				colors="text-advanced"
				show-fallback
				:disabled="disabled"
			></swatches>
		</div>
		<span class="tooltiptext">{{ errorText }}</span>
	</div>
</template>

<style scoped>
div.field {
	display: inline-flex;
	align-items: center;
	width: fit-content;
	flex-direction: column-reverse;
	margin: 0px 10px;
	max-width: 75px;
	min-width: 75px;
	text-align: center;
}

div.field.inputError div.label {
	color: var(--v-error-base, red);
	animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	transition-timing-function: ease-in;
	transform: translate3d(0, 0, 0);
}

div.field.inputError div.input > .vue-swatches >>> div.vue-swatches__trigger {
	border: 2px solid var(--v-error-base, red);
}

/* Tooltip text */
div.field .tooltiptext {
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

div.field.inputError .tooltiptext {
	-webkit-transition: all 0.5s ease 0s;
	-moz-transition: all 0.5s ease 0s;
	-o-transition: all 0.5s ease 0s;
	transition: all 0.5s ease 0s;
}

/* Show the tooltip text when you mouse over the tooltip container */
div.field.inputError:hover .tooltiptext {
	visibility: visible;
	opacity: 1;
	transform: translate(0px, 0px);
}

@keyframes shake {
	20%,
	60% {
		transform: translate3d(-1px, 0, 0);
	}

	40%,
	80% {
		transform: translate3d(2px, 0, 0);
	}
}
</style>

<script>
import Validatable from '../mixins/validatable';
import Swatches from 'vue-swatches';
export default {
	mixins: [Validatable],
	components: {
		Swatches
	},
	props: {
		form: Object,
		label: String,
		value: String
	},
	data() {
		return {};
	},
	methods: {
		onSwatchesClose() {
			this.isDirty = true;
		},
		updateValue(newValue) {
			this.isDirty = true;
			this.$emit('input', newValue);
		}
	},
	mounted() {},
	computed: {
		internalValue() {
			return this.value;
		}
	}
};
</script>
