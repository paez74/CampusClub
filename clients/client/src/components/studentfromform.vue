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
          {{ title }} EstudianteDe
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-424506" tabindex="0">
            <br />
            <div class="children-title">
              <div>
                <a
                  class="filter-button"
                  @click="
                    showStudentfromChildrenFilters = !showStudentfromChildrenFilters
                  "
                  >Filtros <v-icon small>arrow_drop_down</v-icon></a
                >
                <v-spacer></v-spacer>
                <v-btn
                  class="classic-button-icon"
                  v-if="!view && credentials.studentfromCreate"
                  color="primary"
                  @click="showCreateStudentfromChildren = true"
                >
                  Agregar
                </v-btn>
              </div>
              <div>
                <v-container fluid v-if="showStudentfromChildrenFilters">
                  <h3>Filtros</h3>
                  <v-layout row wrap> </v-layout>
                </v-container>
              </div>
            </div>
            <entity-list-table
              :config="studentfromTableConfig"
              :list="filterStudentfromChildrenList"
            >
              <template slot-scope="{ props }"> </template>
            </entity-list-table>
            <studentfrom-create
              v-if="showCreateStudentfromChildren"
              @close="showCreateStudentfromChildren = false"
              @save="addStudentfromChildren"
              :formEdit="form.studentfromEdit"
              :parent="grandParent"
              modalWidth="75%"
              modalHeight="auto"
            ></studentfrom-create>
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
import entityListTable from './entity-list-table';
import studentfromCreate from './modals/studentfrom-create';

export default {
  mixins: [Form],
  components: {
    studentfromCreate,
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
      grandParent: 'studentfrom',
      showImageModal: false,
      imagePreviewId: '',
      form: {
        children: []
      },
      showCreateStudentfromChildren: false,
      studentfromTableConfig: {
        headers: [],
        enableContextMenu: true,
        hasLoading: false,
        showView: () => this.credentials.studentfromRead,
        showEdit: () => this.credentials.studentfromUpdate && !this.view,
        showDelete: () => this.credentials.studentfromDelete && !this.view,
        pagination: {},
        classicTheme: true,
        actions: (type, item) => {
          const actionsMap = {
            view: () => this.goTo('/studentfromdetail/' + item.id),
            edit: () => this.goTo('/studentfromform/' + item.id),
            delete: () => this.deleteStudentfromChildren(item)
          };
          actionsMap[type]();
        }
      },

      searchStudentfromChildren: {},
      showStudentfromChildrenFilters: false
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        this.$http.get('studentfrom/form').then((response) => {
          var newform = response.body.data.studentfrom;
          newform.children = [];
          this.form = newform;
        });
      }
    },
    addStudentfromChildren(item) {
      this.showCreateStudentfromChildren = false;
      this.form.children.push(item);
    },
    deleteStudentfromChildren(item) {
      this.form.children = _.reject(this.form.children, function(i) {
        return i === item;
      });
      if (this.form.childrenToDelete) {
        this.form.childrenToDelete.push(item);
      } else {
        this.form.childrenToDelete = [item];
      }
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('studentfrom/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.studentfrom;

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
          this.$http.put('studentfrom/' + this.id, this.form).then(
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
          this.$http.post('studentfrom/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/studentfromlist');
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
    filterStudentfromChildrenList: function() {
      return this.form.children || [];
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
  row-gap: 10px;
  column-gap: 10px;
}

.grid-container .wrapper-424506 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 3;
}
</style>
