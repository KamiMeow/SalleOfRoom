<template>
  <v-container grid-list-xl>
    <v-layout justify-center>
      <v-flex xs12 lg10>
        <form-base
          :title="`${id ? 'Редактирование' : 'Добавление'} недвижимости`"
          ref="form"
          with-back-button
          @submit="handleSubmit"
        >
          <template #afterTitle>
            <v-layout justify-space-around wrap>
              <v-flex xs6 lg3>
                <v-select
                  v-model="realty.transactionTypeId"
                  :rules="[rulesList.required]"
                  :items="transaction"
                  label="Тип объявления"
                  item-text="Name"
                  item-value="Id"
                />
              </v-flex>

              <v-flex xs6 lg3 v-if="id">
                <v-text-field
                  v-model="realty.priceArea"
                  :rules="[rulesList.required]"
                  label="р/м2"
                  type="number"
                  min="0"
                />
              </v-flex>

              <v-flex xs6 lg3>
                <v-text-field
                  v-model="realty.commission"
                  :rules="[rulesList.required]"
                  label="Комииссия"
                  type="number"
                  min="0"
                />
              </v-flex>

              <v-flex xs6 lg3>
                <v-text-field
                  v-model="realty.price"
                  :rules="[rulesList.required]"
                  style="max-width: 250px"
                  class="pr-3"
                  type="number"
                  label="Цена"
                  min="0"
                />
              </v-flex>
            </v-layout>
          </template>

          <v-layout
            class="py-2"
            justify-space-around
            wrap
          >
            <v-flex xs12 lg6>
              <types-form />
            </v-flex>

            <v-flex xs12 lg6>
              <measuring-form />
            </v-flex>

            <v-flex xs12 lg6>
              <address-form />
            </v-flex>

            <v-flex xs12 lg6>
              <huita-form />
            </v-flex>

            <v-flex xs12 lg6>
              <map-form />
            </v-flex>

            <v-flex xs12 lg6>
              <photos-form />
            </v-flex>

            <v-flex xs12>
              <services-form />
            </v-flex>
          </v-layout>

          <template #actions>
            <v-btn
              :loading="loading"
              color="primary"
              type="submit"
              block
            >{{ id ? 'Изменить' : 'Создать' }}</v-btn>
          </template>
        </form-base>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import FormBase from '@/components/base/FormBase';
import MeasuringForm from './MeasuringForm';
import ServicesForm from './ServicesForm';
import AddressForm from './AddressForm';
import PhotosForm from './PhotosForm';
import TypesForm from './TypesForm';
import HuitaForm from './HuitaForm';
import MapForm from './MapForm';


import { mask } from 'vue-the-mask';

export default {
  name: 'RealtiesModify',

  components: {
    MeasuringForm,
    ServicesForm,
    AddressForm,
    PhotosForm,
    TypesForm,
    HuitaForm,
    FormBase,
    MapForm,
  },

  directives: {
    mask,
  },

  created() {
    if (this.id) {
      this.loadRealty();
    }
    this.loadTransaction();

    if (this.$store.getters['auth/getUserRole'] === 'realtor') {
      console.log('da', this.$store.getters['auth/getUserId']);
      this.realty.realtorId = this.$store.getters['auth/getUserId'];
    }
  },

  data: () => ({
    phoneMask: '+7 (###) ###-##-##',
    loading: false,
  }),

  computed: {
    realty() {
      return this.$store.getters['realties/getRealty'];
    },
    id() {
      return this.$route.params.id;
    },
    transaction() {
      return this.$store.getters['types/getTransaction'];
    },
  },

  methods: {
    async loadRealty() {
      await this.$store.dispatch('realties/loadRealty', this.id);
    },
    async loadTransaction() {
      await this.$store.dispatch('types/loadTransaction');
    },

    async handleSubmit() {
      let response;
      this.loading = true;

      if (this.id) {
        response = await this.updateRealty(this.id);
      }
      else {
        response = await this.createRealty();
      }
      this.loading = false;
      const { error, data } = response;

      if (error) {
        const error = Object.values(data.ModelState)[0][0];
        this.$refs.form.setError(error);
        this.$store.dispatch('notification/set', {
          message: error,
          type: 'error',
        });
      }
      else {
        setTimeout(() => {
          this.$router.push({ name: 'realties.list' });
          this.$store.dispatch('realties/clearRealty');
        }, 1000)
      }
    },

    async createRealty() {
      const { error, data } = await this.$store.dispatch('realties/createRealty', this.isAdmin);
      return { error, data };
    },
    async updateRealty() {
      const { error, data } = await this.$store.dispatch('realties/updateRealty', this.id);
      return { error, data };
    },
  },
};
</script>
