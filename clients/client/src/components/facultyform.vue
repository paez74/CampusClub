<template>
  <div>
    <v-progress-linear
      :indeterminate="requesting"
      v-if="requesting"
      class="loading"
    ></v-progress-linear>
    <v-form ref="form" v-model="valid">
      <v-toolbar dense flat color="transparent" class="toolbar-form">
        <v-toolbar-title class="custom-title">
          <v-icon class="cursor-pointer back-icon" @click="goBack()"
            >keyboard_arrow_left</v-icon
          >
          {{ title }} Facultad
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-850229" tabindex="0">
            <v-select
              v-model="form.rank"
              :items="ranks"
              class="classic-select-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Rango<span>*</span></template
              >
            </v-select>
          </div>
          <div class="wrapper-special wrapper-3377307" tabindex="1">
            <v-divider class="header divider-container"></v-divider>
            <div class="text divider-container">
              <div>
                Trabaja En
              </div>
            </div>
          </div>
          <div class="wrapper-1612754" tabindex="2">
            <div class="many-to-one-input-container">
              <v-select
                v-model="form.worksInId"
                ref="worksIn"
                :items="worksIns"
                class="classic-select-field"
                item-text="name"
                item-value="id"
                @change="onChangeWorksInSelect"
                :disabled="view"
                :rules="[]"
              >
                <template slot="prepend"
                  >Departamento</template
                >
              </v-select>
              <v-speed-dial
                v-model="worksInFab"
                :top="false"
                :bottom="false"
                :right="false"
                :left="false"
                :direction="direction"
                :open-on-hover="false"
                :transition="transition"
                class="generator"
              >
                <v-btn
                  slot="activator"
                  v-model="worksInFab"
                  color="primary"
                  dark
                  fab
                  small
                >
                  <v-icon>menu</v-icon>
                  <v-icon>close</v-icon>
                </v-btn>
                <v-btn
                  small
                  fab
                  color="accent"
                  v-if="credentials.departmentRead"
                  :disabled="!form.worksInId"
                  @click="
                    showFormWorksIn = true;
                    formWorksInId = form.worksInId;
                    viewFormWorksIn = true;
                  "
                >
                  <v-icon>visibility</v-icon>
                </v-btn>
                <v-btn
                  dark
                  small
                  fab
                  color="primary"
                  v-if="credentials.departmentCreate"
                  @click="
                    showFormWorksIn = true;
                    formWorksInId = undefined;
                    viewFormWorksIn = false;
                  "
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-speed-dial>
              <department-modal-form
                v-if="showFormWorksIn"
                @save="onSaveFormWorksIn"
                @close="showFormWorksIn = false"
                :id="formWorksInId"
                :view="viewFormWorksIn"
              ></department-modal-form>
            </div>
          </div>
          <div class="wrapper-special wrapper-5089067" tabindex="3">
            <v-divider class="header divider-container"></v-divider>
            <div class="text divider-container">
              <div>
                Consejero de
              </div>
            </div>
          </div>
          <div class="wrapper-3370673" tabindex="4">
            <br />
            <div>
              <div class="relationship-title">
                <div>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="classic-button-icon"
                    v-if="!view && credentials.campusClubCreate"
                    color="primary"
                    @click="showCreateAdvisorOf = true"
                  >
                    Agregar
                  </v-btn>
                </div>
                <div>
                  <v-text-field
                    v-model="searchAdvisorOf"
                    class="classic-text-field"
                  >
                    <template slot="prepend"
                      >Búsqueda...</template
                    >
                  </v-text-field>
                </div>
              </div>
              <entity-list-table
                :config="advisorOfTableConfig"
                :list="filterAdvisorOfsList"
              >
                <template slot-scope="{ props }">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.phone }}</td>
                </template>
              </entity-list-table>
              <campusClub-create
                v-if="showCreateAdvisorOf"
                @close="showCreateAdvisorOf = false"
                @save="addAdvisorOf"
                :formEdit="advisorOfEdit"
                :parent="grandParent"
                modalWidth="75%"
                modalHeight="auto"
              ></campusClub-create>
            </div>
          </div>
          <div class="wrapper-special wrapper-6695979" tabindex="5">
            <v-btn color="secondary" @click="goBack()" class="backBtn">{{
              view ? 'Regresar' : 'Cancelar'
            }}</v-btn>
          </div>
          <div class="wrapper-special wrapper-8600899" tabindex="6">
            <v-btn
              color="primary"
              :disabled="requesting || view"
              @click="save()"
              class="saveBtn"
              >Guardar</v-btn
            >
          </div>
        </div>
      </div>
    </v-form>
    <image-preview
      v-if="showImageModal"
      :imageId="imagePreviewId"
      @close="showImageModal = false"
    ></image-preview>
  </div>
</template>

<script>
import Form from '../mixins/form';
import { _ } from 'underscore';
import moment from 'moment-timezone';
import departmentModalForm from './modals/department-form';
import campusClubCreate from './modals/campusClub-create';
import entityListTable from './entity-list-table';

export default {
  mixins: [Form],
  components: {
    departmentModalForm,
    campusClubCreate,
    entityListTable
  },
  data() {
    return {
      title: 'Agregar',
      valid: true,
      requesting: false,
      view: false,
      id: '',
      moment,
      grandParent: 'faculty',
      transition: 'slide-y-reverse-transition',
      direction: 'top',
      showFormWorksIn: false,
      viewFormWorksIn: false,
      formWorksInId: undefined,
      worksInFab: false,
      showImageModal: false,
      imagePreviewId: '',
      form: {
        worksIn: {},
        advisorOfs: []
      },
      worksIns: [],
      showSelectWorksIn: false,
      advisorOfEdit: null,
      showCreateAdvisorOf: false,
      advisorOfTableConfig: {
        headers: [
          { text: 'Nombre', value: 'name' },
          { text: 'Telefono', value: 'phone' }
        ],
        enableContextMenu: true,
        hasLoading: false,
        showView: () => this.credentials.campusClubRead,
        showEdit: () => this.credentials.campusClubUpdate && !this.view,
        showDelete: () => this.credentials.campusClubDelete && !this.view,
        pagination: {},
        classicTheme: true,
        actions: (type, item) => {
          const actionsMap = {
            view: () => this.goTo('/campusClubdetail/' + item.id),
            edit: () => {
              this.id
                ? this.goTo('/campusClubform/' + item.id)
                : (this.advisorOfEdit = item);
              this.showCreateAdvisorOf = true;
            },
            delete: () => this.deleteAdvisorOf(item)
          };
          actionsMap[type]();
        }
      },
      ranks: [
        { value: 'instructor', text: 'Instructor' },
        { value: 'assistant', text: 'Asistente' },
        { value: 'associate', text: 'Asociado' },
        { value: 'head', text: 'Titular' }
      ],

      searchAdvisorOf: ''
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        this.$http.get('faculty/form').then((response) => {
          var newform = response.body.data.faculty;
          newform.worksIn = {};
          newform.advisorOfs = [];
          this.form = newform;
          _.each(response.body.data.worksIns, function(item) {
            item.selected = false;
          });
          self.worksIns = response.body.data.worksIns;
        });
      }
    },
    openSelectWorksIn() {
      if (!this.view) {
        this.showSelectWorksIn = true;
      }
    },
    onChangeWorksInSelect(value) {
      this.form.worksIn = this.worksIns.find((worksIn) => worksIn.id === value);
    },
    setWorksIn(item) {
      this.form.worksInId = item.id;
      this.form.worksIn = item;
    },
    onSaveFormWorksIn(value) {
      if (value.isNew) {
        this.worksIns.push(value.values);
      } else {
        Object.assign(
          this.worksIns.find((x) => x.id == value.values.id),
          value.values
        );
      }
      this.setWorksIn(value.values);
    },
    addAdvisorOf(item) {
      this.showCreateAdvisorOf = false;
      if (this.advisorOfEdit == null) this.form.advisorOfs.push(item);
      this.advisorOfEdit = null;
    },
    deleteAdvisorOf(item) {
      this.form.advisorOfs = _.reject(this.form.advisorOfs, function(i) {
        return i === item;
      });
      if (this.form.advisorOfsToDelete) {
        this.form.advisorOfsToDelete.push(item);
      } else {
        this.form.advisorOfsToDelete = [item];
      }
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('faculty/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.faculty;
          if (this.form.worksIn == null) {
            this.form.worksIn = {};
          } else {
            this.form.worksInId = this.form.worksIn.id;
          }
          _.each(response.body.data.worksIns, (item) => {
            item.selected = false;
          });
          this.worksIns = response.body.data.worksIns;

          this.requesting = false;
        },
        (error) => {
          this.requesting = false;
          this.snackbar(error.message || 'Error al obtener registro');
          this.goBack();
        }
      );
    },
    save() {
      if (this.$refs.form.validate()) {
        this.requesting = true;
        this.form.updatedById = localStorage.getItem('userId');
        if (this.id) {
          this.$http.put('faculty/' + this.id, this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro actualizado con éxito'
              );
              this.goBack();
              this.requesting = false;
            },
            (error) => {
              this.requesting = false;
              var message =
                error.body.message || 'Error al actualizar registro';
              this.snackbar(message);
              console.error(error);
            }
          );
        } else {
          this.form.createdById = localStorage.getItem('userId');
          this.$http.post('faculty/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/facultylist');
              this.requesting = false;
            },
            (error) => {
              this.requesting = false;
              var message = error.body.message || 'Error al crear registro';
              this.snackbar(message);
              console.error(error);
            }
          );
        }
      } else {
        this.snackbar(
          'Error en formulario, favor de revisarlo para continuar.'
        );
      }
    }
  },
  computed: {
    filterAdvisorOfsList: function() {
      var self = this;
      //Unificade Search
      return _.filter(this.form.advisorOfs, function(item) {
        return (
          2 + 2 === 'pez' ||
          !item.name ||
          item.name
            .toLowerCase()
            .includes(self.searchAdvisorOf.toLowerCase()) ||
          !item.phone ||
          item.phone.toLowerCase().includes(self.searchAdvisorOf.toLowerCase())
        );
      });
    },
    filterWorksIns: function() {
      return this.worksIns.filter((worksIn) => [true].every((x) => x));
    }
  },
  watch: {}
};
</script>

<style scoped>
.loading {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  margin: 0;
}

.grid-container {
  grid-template-columns: repeat(12, calc((100% - 11 * 10px) / 12));
  grid-auto-rows: minmax(15px, auto);
  row-gap: 6px;
  column-gap: 10px;
}

.grid-container .wrapper-850229 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
  height: calc((4 * 6px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-3377307 {
  grid-column: 1 / span 12;
  grid-row: 6 / span 1;
}

.grid-container .wrapper-1612754 {
  grid-column: 1 / span 12;
  grid-row: 7 / span 5;
}
.grid-container .wrapper-5089067 {
  grid-column: 1 / span 12;
  grid-row: 12 / span 1;
}

.grid-container .wrapper-3370673 {
  grid-column: 1 / span 12;
  grid-row: 13 / span 5;
}
.grid-container .wrapper-6695979 {
  grid-column: 4 / span 2;
  grid-row: 18 / span 3;
}

.grid-container .wrapper-8600899 {
  grid-column: 7 / span 2;
  grid-row: 18 / span 3;
}
</style>
