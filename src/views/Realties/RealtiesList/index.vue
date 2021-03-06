<template>
  <v-layout wrap class="elevation-4">
    <top-bar
      v-model="search"
      title="Недвижимость"
      typografy="headline"
      @action="addRealties"
    >
      <template #beforeSearch>
        <v-layout>
          <v-checkbox
            v-model="onlyMy"
            label="Мои объекты"
            class="mr-8 headline"
          />
          <v-checkbox
            v-model="isDisabled"
            label="Архив"
            class="mr-8 headline"
          />
        </v-layout>
      </template>
    </top-bar>

    <v-flex xs12 class="my-4 px-4">
      <v-dialog max-width="600px" v-if="isAdmin">
        <template #activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            Фиды для выгрузки
          </v-btn>
        </template>

        <v-card class="pa-6" v-if="">
          <div class="mt-2">
            ДомКлик: 
            <a href="https://mayak-reality.com/v1/api/feed/dom-click">https://mayak-reality.com/v1/api/feed/dom-click</a>
          </div>
          <div class="mt-2">
            Мир квартир:
            <a href="https://mayak-reality.com/v1/api/feed/mir-kvartir">https://mayak-reality.com/v1/api/feed/mir-kvartir</a>
          </div>
          <div class="mt-2">
            Где этот дом:
            <a href="https://mayak-reality.com/v1/api/feed/gde-etot-dom">https://mayak-reality.com/v1/api/feed/gde-etot-dom</a>
          </div>
          <div class="mt-2">
            Рестат:
            <a href="https://mayak-reality.com/v1/api/feed/restat">https://mayak-reality.com/v1/api/feed/restat</a>
          </div>
        </v-card>
      </v-dialog>

      <realties-filters @apply-filters="applyFilters" />
    </v-flex>

    <v-flex xs12>
      <v-tabs v-model="tabs">
        <v-tab>Карта</v-tab>
        <!-- <v-tab>Плитка</v-tab> -->
        <v-tab>Список</v-tab>

        <v-tab-item>
          <realties-map :search="search" />
        </v-tab-item>

        <!-- <v-tab-item class="pa-4">
          <realties-card :realties="realties" with-actions />
        </v-tab-item> -->

        <v-tab-item>
          <realties-table
            :total-items="totalItems"
            :page.sync="page"
            :search="search"
            @apply-filters="applyFilters"
          />
        </v-tab-item>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>
import TopBar from '@/components/base/TopBar';
import RealtiesFilters from './RealtiesFilters';
import RealtiesTable from './RealtiesTable';
import RealtiesCard from './RealtiesCard';
import RealtiesMap from './RealtiesMap';

export default {
  name: 'RealtiesListPage',

  components: {
    RealtiesFilters,
    RealtiesTable,
    RealtiesCard,
    RealtiesMap,
    TopBar,
  },

  created() {
    this.applyFilters();
  },

  data: () => ({
    isDisabled: false,
    onlyMy: false,

    totalItems: 1,
    search: '',
    page: 1,

    tabs: '',
  }),

  computed: {
    isAdmin() {
      return this.$store.getters['auth/getUserRole'] === 'admin';
    },

    realties() {
      return this.$store.getters['realties/getRealties'](false);
    },
    isTable() {
      return this.tabs === 1;
    },
  },

  methods: {
    async loadRealties() {
      this.loading = true;
      const { error, data } = await this.$store.dispatch('realties/loadRealties', {
        isDisabled: this.isDisabled,
        isTable: this.isTable,
        search: this.search,
        onlyMy: this.onlyMy,
        page: this.page,
        my: this.onlyMy,
      });
      if (!error) {
        this.totalItems = data;
      }
      this.loading = false;
    },

    addRealties() {
      return this.$router.push({ name: 'realties.create' });
    },

    async applyFilters(filters) {
      const { error, data } = (await this.$store.dispatch('realties/applyFilters', {
        isDisabled: this.isDisabled,
        isTable: this.isTable,
        search: this.search,
        onlyMy: this.onlyMy,
        page: this.page,
        my: this.onlyMy,
        filters,
      }));
      if (!error) {
        this.totalItems = data;
      }
      this.loading = false;
    },

    searchInRealties() {
      clearTimeout(this.timer);
      this.timer = null;

      this.timer = setTimeout(this.applyFilters, 500);
    },
  },

  watch: {
    tabs(newVal) {
      this.loadRealties();
    },

    search() {
      this.searchInRealties();
    },
    isDisabled() {
      this.loadRealties();
    },
    page() {
      this.loadRealties();
    },
    onlyMy() {
      this.loadRealties();
    },
  },
};
</script>
