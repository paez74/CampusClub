<template>
	<div class="percentage-input-wrapper">
		<v-currency-field
			v-bind="percentage_config"
			:disabled="disabled"
			v-model="computedValue"
			class="classic-text-field"
			:rules="[
				(v) =>
					RegExp('^[0-9]{1,13}(\.[0-9]*)?$').test(v.replace(/,/gi, '')) ||
					'Número Inválido.'
			]"
			@keydown.native="checkMaxSafeInteger($event)"
		>
		</v-currency-field>
		<div class="label-prepend">
			{{ label }}
		</div>
	</div>
</template>

<script>
import {
	percentage_config,
	parsePercentageToNumber,
	parseNumberToPercentage
} from '../utils/util';

export default {
	props: {
		label: String,
		disabled: Boolean,
		value: Number
	},
	data() {
		return {
			percentage_config
		};
	},
	methods: {
		updateValue(newValue) {
			this.$emit('input', newValue);
		}
	},
	computed: {
		computedValue: {
			get: function() {
				if (parsePercentageToNumber(this.value) == null) {
					return 0;
				}
				return parsePercentageToNumber(this.value);
			},
			set: function(value) {
				this.updateValue(parseNumberToPercentage(value));
			}
		}
	}
};
</script>
