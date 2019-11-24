export default {
	name: 'super-method',
	methods: {
		super(methodName, mixinName) {
			let mixin;
			let method;
			if (mixinName) {
				mixin = this.$options.mixins.find((x) => x.name == mixinName);
				if (!mixin) throw new Error('No mixin found with that name.');
				method = mixin.methods[methodName];
				if (!method)
					throw new Error('No method found with that name in the mixin.');
			} else {
				Object.keys(this.$options.mixins).forEach((key) => {
					method = this.$options.mixins[key].methods[methodName];
					if (method) return;
				});
				if (!method)
					throw new Error('No method found with that name in the mixins.');
			}
			return method.bind(this);
		}
	}
};
