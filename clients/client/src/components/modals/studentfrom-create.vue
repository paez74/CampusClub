<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      :width="mWidth"
      :height="mHeight"
      scrollable
    >
      <v-card>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-toolbar dense flat color="transparent" class="toolbar-form">
              <v-toolbar-title class="custom-title">
                {{ title }} EstudianteDe
              </v-toolbar-title>
            </v-toolbar>
            <div ref="printForm">
              <div class="grid-container">
                <div class="wrapper-424506" tabindex="0"></div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.grid-container {
  grid-auto-rows: minmax(15px, auto);
  row-gap: 10px;
  column-gap: 10px;
}

.grid-container .wrapper-424506 {
  grid-column: span 2;
  grid-row: span 1;
}
</style>

<script>
import { events } from '../../main';
import {
  formatDate,
  formatDateToTimeOnly,
  formatStringTime
} from '../../utils/util';
import Modal from '../../mixins/modal';
import { _ } from 'underscore';
import moment from 'moment-timezone';

export default {
  props: ['parent', 'modalWidth', 'modalHeight', 'formEdit'],
  mixins: [Modal],
  components: {},
  data() {
    return {
      formatDate,

      title: '',
      requesting: false,
      sending: false,
      valid: true,
      view: false,
      id: '',
      form: {}
    };
  },
  methods: {
    dataInit() {
      var self = this;
      this.$http.get(`studentfrom/form`).then((response) => {
        var newform = response.body.data.studentfrom;
        if (self.formEdit == null) this.form = newform;
        else {
          this.form = self.formEdit;
        }
      });
      if (self.formEdit != null) this.form = this.formEdit;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.form.createdById = localStorage.getItem('userId');
        this.form.updatedById = this.form.createdById;
        this.$emit('save', this.form);
      }
    }
  },
  mounted() {
    this.dataInit();
  },
  filters: {
    moment: function(date) {
      return formatDate(date);
    },
    dateToTimeOnly: function(date) {
      return formatDateToTimeOnly(date);
    }
  },
  computed: {
    mWidth: {
      get: function() {
        return this.modalWidth;
      }
    },
    mHeight: {
      get: function() {
        return this.modalHeight;
      }
    }
  },
  watch: {}
};
</script>
