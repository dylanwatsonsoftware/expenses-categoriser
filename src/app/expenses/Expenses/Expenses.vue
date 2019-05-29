<template>
  <div :class="$style.expenses">
    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <div style="width:50%">
            <vue-donut-chart title="Expenses" :data="donutData" unit="AUD"/>
          </div>

          <vue-data-table
            :header="header"
            :data="data"
            :maxRows="100"
            placeholder="Search"
            @click="click"
          >
            <template v-slot:coloured="{ cell, row }">
              <button
                v-if="cell.key === 'Narration' && !cell.hideSearch"
                @click="getABNName(cell, row)"
              >Search</button>
              <div :style="{ color: colour(row) }">
                {{narrationMap[cell.value]}}
                <br>
                {{cell.value}}
              </div>
            </template>
          </vue-data-table>
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>
    <br>
    <br>
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
import VueDonutChart from '@/app/shared/components/VueDonutChart/VueDonutChart.vue';
import axios from 'axios';
import moment from 'moment';

import * as _ from 'lodash';

import Papa from 'papaparse';
import { Category, Categoriser } from './categoriser';

export default {
  metaInfo: {
    title: 'Expenses',
  },
  data: () => {
    return {
      narrationMap: {
        'PLINE PH JOONDALUP631    JOONDALUP': 'Priceline Pharmacy',
        'WEST LEEDERVILLE         WEST LEEDERVIWA': 'Hylin',
      },
      header: {},
      data: [],
    };
  },
  components: {
    VueGrid,
    VueGridItem,
    VueButton,
    VueGridRow,
    VueHeadline,
    VueDataTable,
    VueDonutChart,
  },
  methods: {
    ...mapActions('expenses', ['increment', 'decrement']),
    click(row: any) {
      console.log(row);
    },
    async loadCSV(file: string) {
      let categoriser : Categoriser = new Categoriser();

      Papa.parse(file, {
        header: true,
        download: true,
        complete: (results) => {
          console.log(file, results);

          var header: any = {};
          for (var key of Object.keys(results.data[0])) {
            header[key] = {
              title: key,
              slot: 'coloured',
            };
          }

          header['Category'] = {
            title: 'Category',
            slot: 'coloured',
          };
          header['SubCategory'] = {
            title: 'SubCategory',
            slot: 'coloured',
          };
          header['File'] = {
            title: 'File',
            slot: 'coloured',
          };
          this.header = header;

          results.data.forEach((row) => {
            row['File'] = file;

            categoriser.categoriseAll(row);
          });

          this.data.push(...results.data.filter((row) => row.Narration && row.Narration.length));
        },
      });
    },
    colour(row: any) {
      return row['Narration'] && row.Category ? 'black' : 'red';
    },
    async getABNName(cell: any) {
      console.log(cell.value);

      if (this.narrationMap[cell.value]) {
        return;
      }

      const abrName = cell.value.split('  ')[0];

      let result = await axios.get('/abr/names', {
        params: {
          maxResults: 1,
          name: abrName,
        },
      });

      let foundAbn = result.data.Names[0];
      console.log(foundAbn);
      if (!foundAbn) {
        console.log('No ABN found');
        return;
      }

      this.$set(this.narrationMap, cell.value, foundAbn.Name);

      let abnResult = await axios.get('/abr/abn', {
        params: {
          maxResults: 1,
          abn: foundAbn.Abn,
        },
      });

      if (abnResult.data.BusinessName.length) {
        this.$set(this.narrationMap, cell.value, abnResult.data.BusinessName[0] + ' - ' + foundAbn.Name);
        console.log('BusinessName', abnResult.data.BusinessName[0] + ' - ' + foundAbn.Name);
      } else {
        console.log('No business name found');
      }
      console.log(abnResult.data);
    },
  },
  computed: {
    ...mapGetters('expenses', ['count', 'incrementPending', 'decrementPending']),
    donutData() {
      if (!this.data.length) {
        return [];
      }

      let lastDate = moment(this.data[this.data.length - 1]['Transaction Date'], 'DD/MM/YYYY');

      let monthsSince = moment().diff(lastDate, 'months', true);
      console.log('Transactions cover ' + monthsSince + ' months');

      let categories = _.groupBy(this.data, 'Category');
      let categoryArray = [];
      let donutData: { label: string; value: Number }[] = [];
      for (let key in <any>categories) {
        donutData.push({
          label: key === 'undefined' ? 'Other' : key,
          value: Math.round(
            _.sumBy(
              categories[key].map((r: any) => ({
                ...r,
                Debit: parseFloat(r.Debit) || 0,
              })),
              'Debit',
            ) / monthsSince,
          ),
        });
      }

      return donutData;
    },
  },
  beforeCreate() {
    registerModule('expenses', ExpensesModule);
  },
  created() {
    this.loadCSV('/CreditCard_transaction_27_05_2019.csv'); // Credit Card
    this.loadCSV('/Var1_transaction_27_05_2019.csv'); // Variable Offset
    this.loadCSV('/Fixed1_transaction_27_05_2019.csv'); // Fixed Offset - Everyday
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