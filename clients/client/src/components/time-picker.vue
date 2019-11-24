<template>
	<div class="time-picker">
		<div class="prepend-label" v-bind:class="errorLabel" v-if="prependLabel">
			{{ label }}<span v-if="requiredLabel">*</span>
		</div>
		<v-menu
			class="time-menu"
			ref="timeMenu"
			:close-on-content-click="false"
			v-model="timeMenu"
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
				:value="timeFormatted"
				:label="computedLabel"
				append-icon="access_time"
				:disabled="disabled"
				readonly
				:rules="rules"
				ref="textField"
			>
			</v-text-field>
			<v-time-picker
				v-bind:value="value"
				v-on:input="updateValue"
				:locale="$i18n.locale"
				scrollable
			>
				<v-spacer></v-spacer>
				<v-btn v-if="showCleanButton" flat color="primary" @click="clean()">{{
					$t('message.datetimePickerClean')
				}}</v-btn>
				<v-btn flat color="primary" @click="timeMenu = false">{{
					$t('message.datetimePickerCancel')
				}}</v-btn>
				<v-btn flat color="primary" @click="$refs.timeMenu.save(value)">{{
					$t('message.datetimePickerAccept')
				}}</v-btn>
			</v-time-picker>
		</v-menu>
	</div>
</template>

<style scoped>
.time-picker {
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

.time-menu {
	width: 100%;
}
</style>

<script>
import { formatStringTime } from '../utils/util';
export default {
	props: {
		disabled: Boolean,
		label: String,
		prependLabel: Boolean,
		requiredLabel: Boolean,
		showCleanButton: Boolean,
		rules: Array,
		value: String
	},
	data() {
		return {
			formatStringTime,
			timeMenu: false
		};
	},
	methods: {
		updateValue(newValue) {
			this.$emit('input', newValue);
		},
		clean() {
			this.$emit('input', undefined);
		}
	},
	computed: {
		timeFormatted: function() {
			if (this.value) {
				return formatStringTime(this.value);
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
		timeMenu: function(oldMenuState, newMenuState) {
			if (!oldMenuState && newMenuState) {
				this.$refs.textField.validate(true);
				this._computedWatchers.errorLabel.evaluate();
			}
		}
	}
};
</script>
