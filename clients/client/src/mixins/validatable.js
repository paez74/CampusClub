import { inject as RegistrableInject } from './registrable';
export default {
	name: 'validatable',
	mixins: [RegistrableInject('form')],
	props: {
		disabled: Boolean,
		error: Boolean,
		errorCount: {
			type: [Number, String],
			default: 1
		},
		errorMessages: {
			type: [String, Array],
			default: () => []
		},
		messages: {
			type: [String, Array],
			default: () => []
		},
		readonly: Boolean,
		rules: {
			type: Array,
			default: () => []
		},
		success: Boolean,
		successMessages: {
			type: [String, Array],
			default: () => []
		},
		validateOnBlur: Boolean
	},
	data() {
		return {
			isDirty: false,
			formAssign: false,
			errorBucket: [],
			hasColor: false,
			hasFocused: false,
			hasInput: false,
			isFocused: false,
			isResetting: false,
			valid: false
		};
	},
	methods: {
		// //VForm validatable
		/** @public */
		reset() {
			this.isResetting = true;
			this.deleteImage();
		},
		/** @public */
		resetValidation() {
			this.isResetting = true;
		},
		/** @public */
		validate(force = false, value = this.internalValue) {
			const errorBucket = [];

			if (force) this.hasInput = this.hasFocused = true;

			for (let index = 0; index < this.rules.length; index++) {
				const rule = this.rules[index];
				const valid = typeof rule === 'function' ? rule(value) : rule;

				if (valid === false || typeof valid === 'string') {
					errorBucket.push(valid);
				} else if (valid !== true) {
					console.log(
						`Rules should return a string or boolean, received '${typeof valid}' instead`,
						this
					);
				}
			}

			this.errorBucket = errorBucket;
			this.valid = errorBucket.length === 0;
			return this.valid;
		},
		rulesWatcher(newVal, oldVal) {
			if (deepEqual(newVal, oldVal)) return;
			this.validate();
		}
	},
	mounted() {},
	beforeMount() {
		this.validate();
	},
	created() {
		this.form && this.form.register(this);
	},
	beforeDestroy() {
		this.form && this.form.unregister(this);
	},
	computed: {
		internalValue() {
			throw new Error('Not Implemented InternalValue in custom component');
		},
		errorText() {
			return this.errorBucket[0];
		},
		hasError() {
			return (
				this.internalErrorMessages.length > 0 ||
				this.errorBucket.length > 0 ||
				this.error
			);
		},
		externalError() {
			return this.internalErrorMessages.length > 0 || this.error;
		},
		hasSuccess() {
			return this.successMessages.length > 0 || this.success;
		},
		hasMessages() {
			return this.validations.length > 0;
		},
		hasState() {
			return this.hasSuccess || (this.shouldValidate && this.hasError);
		},
		internalErrorMessages() {
			return this.errorMessages || '';
		},
		shouldValidate() {
			return (
				this.externalError ||
				(!this.isResetting &&
					(this.validateOnBlur
						? this.hasFocused && !this.isFocused
						: this.hasInput || this.hasFocused))
			);
		},
		validations() {
			return this.validationTarget.slice(0, this.errorCount);
		},
		validationState() {
			if (this.hasError && this.shouldValidate) return 'error';
			if (this.hasSuccess) return 'success';
			if (this.hasColor) return this.color;
			return null;
		},
		validationTarget() {
			const target =
				this.internalErrorMessages.length > 0
					? this.errorMessages
					: this.successMessages.length > 0
					? this.successMessages
					: this.messages;

			// String
			if (!Array.isArray(target)) {
				return [target];
				// Array with items
			} else if (target.length > 0) {
				return target;
				// Currently has validation
			} else if (this.shouldValidate) {
				return this.errorBucket;
			} else {
				return [];
			}
		}
	},
	watch: {
		form: {
			handler() {
				if (!this.formAssign && !!this.form) {
					this.formAssign = true;
					this.form.register(this);
				}
			}
		},
		rules: {
			handler(newVal, oldVal) {
				this.rulesWatcher(newVal, oldVal);
			},
			deep: true
		},
		internalValue() {
			// If it's the first time we're setting input,
			// mark it with hasInput
			this.hasInput = true;
			this.validateOnBlur || this.$nextTick(this.validate);
		},
		isFocused(val) {
			// Should not check validation
			// if disabled or readonly
			if (!val && !this.disabled && !this.readonly) {
				this.hasFocused = true;
				this.validateOnBlur && this.validate();
			}
		},
		isResetting() {
			setTimeout(() => {
				this.hasInput = false;
				this.hasFocused = false;
				this.isResetting = false;
			}, 0);
		},
		hasError(val) {
			if (this.shouldValidate) {
				this.$emit('update:error', val);
			}
		},
		hasFocused(val) {
			if (val) this.isDirty = true;
		}
	}
};

export function deepEqual(a, b) {
	if (a === b) return true;

	if (a instanceof Date && b instanceof Date) {
		// If the values are Date, they were convert to timestamp with getTime and compare it
		if (a.getTime() !== b.getTime()) return false;
	}

	if (a !== Object(a) || b !== Object(b)) {
		// If the values aren't objects, they were already checked for equality
		return false;
	}

	const props = Object.keys(a);

	if (props.length !== Object.keys(b).length) {
		// Different number of props, don't bother to check
		return false;
	}

	return props.every((p) => deepEqual(a[p], b[p]));
}
