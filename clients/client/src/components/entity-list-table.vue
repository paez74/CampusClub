<template>
	<div>
		<v-data-table
			:headers="filteredHeaders"
			:items="list"
			:loading="loading"
			:class="config.classicTheme ? 'list-table classic-table' : 'list-table'"
			:pagination.sync="config.pagination"
		>
			<v-progress-linear
				v-if="config.hasLoading"
				slot="progress"
				color="primary"
				indeterminate
			></v-progress-linear>
			<template slot="items" slot-scope="props">
				<tr
					v-bind:class="{ itemToDelete: props.item === itemToDelete }"
					@contextmenu="config.enableContextMenu ? show($event, props) : ''"
				>
					<slot :props="props" :context="context"></slot>
				</tr>
			</template>
			<template slot="no-data"
				>No hay registros para sus parámetros de búsqueda. Favor de intentar
				otra búsqueda o crear uno nuevo.</template
			>
		</v-data-table>
		<v-menu
			v-model="showContextMenu"
			:position-x="contextMenuX"
			:position-y="contextMenuY"
			absolute
			offset-y
			v-if="config.enableContextMenu"
		>
			<v-list>
				<v-list-tile
					v-for="item in actionsToShow"
					:key="item.value"
					@click="handleContextMenuClick(item.value)"
				>
					<v-list-tile-title class="menu-tile-option">
						<v-icon color="error">{{ item.icon }}</v-icon>
						<label>{{ item.text }}</label>
					</v-list-tile-title>
				</v-list-tile>
			</v-list>
		</v-menu>

		<v-dialog
			:content-class="'delete-dialog'"
			v-model="deleteDialog"
			max-width="400"
		>
			<v-card>
				<v-card-title class="headline">Eliminar</v-card-title>
				<div class="text">
					<v-card-text
						>Se procederá a borrar el registro seleccionado</v-card-text
					>
					<v-card-text>¿Deseas Continuar?</v-card-text>
				</div>
				<v-card-actions>
					<v-btn color="secondary" @click="deleteDialog = false"
						>Cancelar</v-btn
					>
					<v-btn
						color="primary"
						@click="
							deleteDialog = false;
							deleteRegistry(itemToDelete);
						"
						>Aceptar</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<style scoped>
.menu-tile-option {
	display: flex;
	align-items: center;
}
.menu-tile-option i {
	padding-right: 10px;
	width: 34px;
}

.menu-tile-option label {
	margin-top: 3px;
}
div.list-table >>> th[aria-label*=": Not sorted"] i{
	visibility: hidden;
  	opacity: 0;
  	transition: visibility 0s, opacity 0.5s linear ;
}
</style>

<script>
export default {
	props: {
		config: {
			type: [Object],
			default: () => {}
		},
		list: {
			type: [Object, Array],
			default: () => []
		},
		loading: {
			type: [Boolean],
			default: () => false
		}
	},
	components: {},
	data() {
		return {
			context: this,
			deleteDialog: false,
			showContextMenu: false,
			contextMenuX: 0,
			contextMenuY: 0,
			selectedRow: {},
			itemToDelete: {}
		};
	},
	methods: {
		show(e, props) {
			this.selectedRow = props.item;
			e.preventDefault();
			this.showContextMenu = false;
			this.contextMenuX = e.clientX;
			this.contextMenuY = e.clientY;
			this.$nextTick(() => {
				this.showContextMenu = true;
			});
		},

		handleContextMenuClick(type) {
			if (type === 'deleteDialog') {
				this.confirmDelete(this.selectedRow);
			} else {
				this.config.actions(type, this.selectedRow);
				this.deleteDialog = false;
			}
			this.selectedRow = {};
		},

		confirmDelete(itemToDelete) {
			this.deleteDialog = true;
			this.itemToDelete = itemToDelete;
		},

		deleteRegistry(itemToDelete) {
			this.config.actions('delete', itemToDelete);
			this.itemToDelete = {};
		}
	},
	computed: {
		filteredHeaders: function() {
			return this.config.headers.filter(
				(x) => x.haveViewPermission === undefined || x.haveViewPermission
			);
		},
		actionsToShow: function() {
			const actions = [];
			if (this.showView && this.selectedRow.id)
				actions.push({ text: 'Ver', icon: 'visibility', value: 'view' });
			if (this.showEdit )
				actions.push({ text: 'Editar', icon: 'settings', value: 'edit' });
			if (this.showDelete)
				actions.push({
					text: 'Eliminar',
					icon: 'delete_forever',
					value: 'deleteDialog'
				});
			return actions;
		},
		showView: function() {
			if (!this.config.showView) return false;
			return this.config.showView();
		},
		showEdit: function() {
			if (!this.config.showEdit) return false;
			return this.config.showEdit();
		},
		showDelete: function() {
			if (!this.config.showDelete) return false;
			return this.config.showDelete();
		}
	},
	mounted() {},
	watch: {
		deleteDialog(val) {
			if (!val) this.itemToDelete = {};
		}
	}
};
</script>
