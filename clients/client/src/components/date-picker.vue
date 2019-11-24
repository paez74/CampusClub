<template>
	<div class="date-picker">
		<div class="prepend-label" v-bind:class="errorLabel" v-if="prependLabel">
			{{ label }}<span v-if="requiredLabel">*</span>
		</div>
		<v-menu
			class="date-menu"
			ref="dateMenu"
			:close-on-content-click="false"
			v-model="dateMenu"
			:nudge-right="40"
			lazy
			transition="scale-transition"
			offset-y
			full-width
			min-width="290px"
			:disabled="disabled"
		>
			<v-text-field
				slot="activator"
				append-icon="today"
				:label="computedLabel"
				:value="dateFormatted"
				:disabled="disabled"
				:readonly="!editManually"
				:rules="dateRules"
				ref="textField"
				v-on:input="updateValueManually"
			>
			</v-text-field>
			<v-date-picker
				v-bind:value="value"
				v-on:input="updateValueThroughPicker"
				:locale="$i18n.locale"
				no-title
				scrollable
				v-bind:min="minDate"
			>
				<v-spacer></v-spacer>
				<v-btn v-if="showCleanButton" flat color="primary" @click="clean()">{{
					$t('message.datetimePickerClean')
				}}</v-btn>
				<v-btn flat color="primary" @click="dateMenu = false">{{
					$t('message.datetimePickerCancel')
				}}</v-btn>
				<v-btn flat color="primary" @click="$refs.dateMenu.save(value)">{{
					$t('message.datetimePickerAccept')
				}}</v-btn>
			</v-date-picker>
		</v-menu>
	</div>
</template>

<style scoped>
.date-picker {
	display: flex;
}

.prepend-label {
	text-align: right;
	line-height: 1;
	margin-top: auto;
	margin-bottom: auto;
	margin-right: 10px;
	font-size: 14px;
	transition: all 0.2s ease 0s;
}

.errorLabel {
	color: var(--v-error-base) !important;
}

.date-menu {
	width: 100%;
}
</style>

<script>
import { formatDate, isDateValid, parseDateForPicker } from '../utils/util';
export default {
	props: {
		disabled: Boolean,
		label: String,
		requiredLabel: Boolean,
		prependLabel: Boolean,
		showCleanButton: Boolean,
		rules: Array,
		value: String,
		minDate:String,
		editManually: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			formatDate,
			dateMenu: false,
			dateRules: [],
		};
	},
	methods: {
		updateValueThroughPicker(newValue) {
			this.$emit('input', newValue);
		},
		updateValueManually(newValue) {
			if (isDateValid(newValue)) {
				this.$emit('input', parseDateForPicker(newValue));
			}
		},
		clean() {
			this.$emit('input', undefined);
		}
	},
	computed: {
		dateFormatted: function() {
			if (this.value) {
				return formatDate(this.value);
			}
			return '';
		},
		computedLabel: function() {
			if (!this.prependLabel) {
				return this.label;
			}
			return '';
		},
		errorLabel: function() {
			return {
				errorLabel: this.$refs.textField && !this.$refs.textField.validate(true)
			};
		}
	},
	watch: {
		dateMenu: function(oldMenuState, newMenuState) {
			if (!oldMenuState && newMenuState) {
				this.$refs.textField.validate(true);
				this._computedWatchers.errorLabel.evaluate();
			}
		}
	},
	mounted() {
		this.dateRules = [...this.rules, v => isDateValid(v) || 'Fecha invalida.'];
	}
};
</script>
