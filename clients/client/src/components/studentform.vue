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
          {{ title }} Estudiante
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-1369451" tabindex="0">
            <v-select
              v-model="form.status"
              :items="statuses"
              class="classic-select-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Estatus<span>*</span></template
              >
            </v-select>
          </div>
          <div class="wrapper-special wrapper-3426486" tabindex="1">
            <v-divider class="header divider-container"></v-divider>
            <div class="text divider-container">
              <div>
                Miembro de
              </div>
            </div>
          </div>
          <div class="wrapper-1823911" tabindex="2">
            <br />
            <div class="relationship-title">
              <div>
                <v-spacer></v-spacer>
                <v-btn
                  class="classic-button-icon"
                  color="primary"
                  @click="showSelectMemberOf = true"
                >
                  Agregar
                </v-btn>
              </div>
            </div>

            <entity-list-table
              :config="memberOfTableConfig"
              :list="form.memberOfs"
            >
              <template slot-scope="{ props }">
                <td class="text-xs-left">{{ props.item.phone }}</td>
                <td class="text-xs-left">{{ props.item.name }}</td>
              </template>
            </entity-list-table>
            <campusClub-entity-picker
              v-if="showSelectMemberOf"
              v-bind:parent="grandParent"
              v-bind:searchParams="memberOfSearchParams"
              @close="showSelectMemberOf = false"
              @save="setMemberOf"
            ></campusClub-entity-picker>
          </div>
          <div class="wrapper-special wrapper-4251976" tabindex="3">
            <v-divider class="header divider-container"></v-divider>
            <div class="text divider-container">
              <div>
                Cursando
              </div>
            </div>
          </div>
          <div class="wrapper-2067216" tabindex="4">
            <div class="many-to-one-input-container">
              <v-select
                v-model="form.majorId"
                ref="major"
                :items="filterMajors"
                class="classic-select-field"
                item-text="name"
                item-value="id"
                @change="onChangeMajorSelect"
                :disabled="view"
                :rules="[]"
              >
                <template slot="prepend"
                  >Departamento</template
                >
              </v-select>
              <v-speed-dial
                v-model="majorFab"
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
                  v-model="majorFab"
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
                  :disabled="!form.majorId"
                  @click="
                    showFormMajor = true;
                    formMajorId = form.majorId;
                    viewFormMajor = true;
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
                    showFormMajor = true;
                    formMajorId = undefined;
                    viewFormMajor = false;
                  "
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-speed-dial>
              <department-modal-form
                v-if="showFormMajor"
                @save="onSaveFormMajor"
                @close="showFormMajor = false"
                :id="formMajorId"
                :view="viewFormMajor"
              ></department-modal-form>
            </div>
          </div>
          <div class="wrapper-special wrapper-5038093" tabindex="5">
            <v-btn color="secondary" @click="goBack()" class="backBtn">{{
              view ? 'Regresar' : 'Cancelar'
            }}</v-btn>
          </div>
          <div class="wrapper-special wrapper-6043399" tabindex="6">
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
import campusClubEntityPicker from './modals/campusClub-entity-picker';
import departmentModalForm from './modals/department-form';
import entityListTable from './entity-list-table';

export default {
  mixins: [Form],
  components: {
    campusClubEntityPicker,
    departmentModalForm,
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
      grandParent: 'student',
      transition: 'slide-y-reverse-transition',
      direction: 'top',
      showFormMajor: false,
      viewFormMajor: false,
      formMajorId: undefined,
      majorFab: false,
      showImageModal: false,
      imagePreviewId: '',
      form: {
        memberOfs: [],
        major: {}
      },
      memberOfs: [],
      showSelectMemberOf: false,
      memberOfTableConfig: {
        headers: [
          { text: 'Telefono', value: 'phone' },
          { text: 'Nombre', value: 'name' }
        ],
        enableContextMenu: true,
        hasLoading: false,
        showView: false,
        showEdit: false,
        showDelete: () => this.credentials.campusClubDelete && !this.view,
        pagination: {},
        classicTheme: true,
        actions: (type, item) => {
          const actionsMap = {
            delete: () => this.deleteMemberOf(item)
          };
          actionsMap[type]();
        }
      },
      majors: [],
      showSelectMajor: false,
      statuses: [
        { value: 'freshman', text: 'Freshman' },
        { value: 'sophmore', text: 'Sophmore' },
        { value: 'junior', text: 'Junior' },
        { value: 'senior', text: 'Senior' }
      ]
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        this.$http.get('student/form').then((response) => {
          var newform = response.body.data.student;
          newform.memberOfs = [];
          newform.major = {};
          this.form = newform;
          _.each(response.body.data.memberOfs, function(item) {
            item.selected = false;
          });
          self.memberOfs = response.body.data.memberOfs;
          _.each(response.body.data.majors, function(item) {
            item.selected = false;
          });
          self.majors = response.body.data.majors;
        });
      }
    },
    selectMemberOf(campusClub) {
      var self = this;
      if (!campusClub.selected) {
        self.form.memberOfs = _.filter(self.form.memberOfs, function(relation) {
          return relation.id !== campusClub.id;
        });
      } else {
        if (!self.form.memberOfs) {
          self.form.memberOfs = [];
        }
        self.form.memberOfs.push(campusClub);
      }
    },
    deleteMemberOf(item) {
      this.form.memberOfs = _.reject(this.form.memberOfs, function(i) {
        return i === item;
      });
      if (this.form.memberOfsToDelete) {
        this.form.memberOfsToDelete.push(item);
      } else {
        this.form.memberOfsToDelete = [item];
      }
    },
    openSelectMemberOf() {
      if (!this.view) {
        this.showSelectMemberOf = true;
      }
    },
    setMemberOf(item) {
      let exist = _.find(this.form.memberOfs, (t) => t.id == item.id);
      if (exist) {
        this.snackbar('Relación ya existente');
      } else {
        this.form.memberOfs = this.form.memberOfs.concat(item);
      }
    },
    openSelectMajor() {
      if (!this.view) {
        this.showSelectMajor = true;
      }
    },
    onChangeMajorSelect(value) {
      this.form.major = this.majors.find((major) => major.id === value);
    },
    setMajor(item) {
      this.form.majorId = item.id;
      this.form.major = item;
    },
    onSaveFormMajor(value) {
      if (value.isNew) {
        this.majors.push(value.values);
      } else {
        Object.assign(
          this.majors.find((x) => x.id == value.values.id),
          value.values
        );
      }
      this.setMajor(value.values);
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('student/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.student;
          if (this.form.major == null) {
            this.form.major = {};
          } else {
            this.form.majorId = this.form.major.id;
          }
          _.each(response.body.data.majors, (item) => {
            item.selected = false;
          });
          this.majors = response.body.data.majors;

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
          this.$http.put('student/' + this.id, this.form).then(
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
          this.$http.post('student/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/studentlist');
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
    memberOfSearchParams: function() {
      return {};
    },
    filterMajors: function() {
      return this.majors.filter((major) => [true].every((x) => x));
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

.grid-container .wrapper-1369451 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
  height: calc((4 * 6px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-3426486 {
  grid-column: 1 / span 12;
  grid-row: 6 / span 1;
}

.grid-container .wrapper-1823911 {
  grid-column: 1 / span 12;
  grid-row: 7 / span 5;
}
.grid-container .wrapper-4251976 {
  grid-column: 1 / span 12;
  grid-row: 12 / span 1;
}

.grid-container .wrapper-2067216 {
  grid-column: 1 / span 12;
  grid-row: 13 / span 5;
}
.grid-container .wrapper-5038093 {
  grid-column: 4 / span 2;
  grid-row: 18 / span 3;
}

.grid-container .wrapper-6043399 {
  grid-column: 7 / span 2;
  grid-row: 18 / span 3;
}
</style>
