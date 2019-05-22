<template>
  <div :class="$style.expenses">
    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">Expenses</vue-headline>
        </vue-grid-item>

        <vue-data-table :header="header" :data="data" :maxRows="100" placeholder="Search" @click="click"/>
      </vue-grid-row>
    </vue-grid>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { registerModule } from '@/app/store';
import { ExpensesModule } from '../module';
import { IPreLoad } from '@/server/isomorphic';
import VueGrid from '@/app/shared/components/VueGrid/VueGrid.vue';
import VueGridItem from '@/app/shared/components/VueGridItem/VueGridItem.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import VueGridRow from '@/app/shared/components/VueGridRow/VueGridRow.vue';
import VueHeadline from '@/app/shared/components/VueHeadline/VueHeadline.vue';
import VueDataTable from '@/app/shared/components/VueDataTable/VueDataTable.vue';
import { dataTableHeaderFixture, dataTableDataFixture } from '@/app/shared/components/VueDataTable/DataTableFixtures';

import Papa from 'papaparse';

export default {
  metaInfo: {
    title: 'Expenses',
  },
  data: () => {
    return {
      header: dataTableHeaderFixture,
      data: dataTableDataFixture,
    };
  },
  components: {
    VueGrid,
    VueGridItem,
    VueButton,
    VueGridRow,
    VueHeadline,
    VueDataTable,
  },
  methods: {
    ...mapActions('expenses', ['increment', 'decrement']),
    click(row: any) {
      alert(JSON.stringify(row));
    },
    async loadCSV() {
      Papa.parse('/5524 1138 0113 3684_transaction_22_05_2019.csv', {
        header: true,
        download: true,
        complete: (results) => {
          console.log('results', results);
          var header: any = {};
          for (var key of Object.keys(results.data[0])) {
            header[key] = {
              title: key,
            };
          }
          this.header = header;
          this.data = results.data;

          console.log(this.data);
        },
      });
    },
  },
  computed: {
    ...mapGetters('expenses', ['count', 'incrementPending', 'decrementPending']),
  },
  beforeCreate() {
    registerModule('expenses', ExpensesModule);
  },
  created() {
    this.loadCSV();
  },
  prefetch: (options: IPreLoad) => {
    registerModule('expenses', ExpensesModule);
    return options.store.dispatch('expenses/increment');
  },
};
</script>

<style lang="scss" module>
@import '~@/app/shared/design-system';

.expenses {
  margin-top: $nav-bar-height;
  min-height: 500px;
}
</style>