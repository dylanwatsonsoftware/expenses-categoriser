<template>
  <div :class="$style.expenses">
    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <div style="width:100%">
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
              <div :style="{ color: colour(row) }">{{cell.value}}</div>
            </template>
          </vue-data-table>
        </vue-grid-item>
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
import VueDonutChart from '@/app/shared/components/VueDonutChart/VueDonutChart.vue';
import { dataTableHeaderFixture, dataTableDataFixture } from '@/app/shared/components/VueDataTable/DataTableFixtures';

import * as _ from 'lodash';

import Papa from 'papaparse';

export default {
  metaInfo: {
    title: 'Expenses',
  },
  data: () => {
    return {
      header: dataTableHeaderFixture,
      data: dataTableDataFixture,
      donutData: [
        { label: 'Ironman', value: 892 },
        { label: 'Vision', value: 480 },
        { label: 'Hulk', value: 1506 },
        { label: 'Spiderman', value: 795 },
        { label: 'Thor', value: 579 },
        { label: 'Ant-man', value: 230 },
      ],
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
              slot: 'coloured',
            };
          }

          header['Category'] = {
            title: 'Category',
            slot: 'coloured',
          };

          let categorise = (row: any, filter: string, category: string) => {
            if (!row.Narration || row.Category) return;

            if (new RegExp(filter).test(row.Narration)) {
              row.Category = category;
              console.log(row);
            }
          };

          results.data.forEach((row) => {
            categorise(row, '.*(KMART|RED DOT|BUNNINGS|BEST & LESS).*', 'House');
            categorise(row, '.*(SPUDSHED|COLES|WOOLWORTHS|ALDI|IGA|BAKERY|MR FRESH|VEEOS|FRESH|Fresh|ORIENTAL).*', 'Groceries');
            categorise(row, '.*(MAX AND SONS|LOWDOWN|ALH GROUP|UMA VIDA|YELO|KRUSTYKOB|COFFEE|HOLMES AND CO|96 Express|Holiday Inn City Centr|Coffee|GHIASSI|UTOPIA|Voodoo).*', 'Coffee');
            categorise(row, '.*(REBEL|HBF RUN).*', 'Sport');
            categorise(row, '.*(Menulog|KEBAB|BOOST JUICE|SHY JOHN|GRILLD|SUBWAY|GREENHORNS|SUN KWONG|SUNNYSIDE UP|JAPANESE|SUSHI|FRO YO|MCDONALDS|PHETCHABURA|HAWELI|WILD FIG|MEET AND BUN|KITCHEN|Tim Ho Wan|BURGER).*', 'Food');
            categorise(row, '.*(HAIR|BARBER|NAILS|Threading).*', 'Hair/Makeup');
            categorise(row, '.*(LIQUOR|DAN MURPHYS|STREET EATS).*', 'Alcohol');
            categorise(row, '.*(INSURANCE).*', 'Insurance');
            categorise(row, '.*(NETFLIX).*', 'TV');
            categorise(row, '.*(POST).*', 'Office');
            categorise(row, '.*(BOOKS|AMAZON MKTPLC|BOOKDEPO).*', 'Books');
            categorise(row, '.*(GFP BABIES).*', 'Photos');
            categorise(row, '.*(EBAY).*', 'eBay');
            categorise(row, '.*(BIRTHS DEATHS).*', 'Office');
            categorise(row, '.*(TELSTRA|OPTUS).*', 'Mobile');
            categorise(row, '.*(LATITUDE|PROUDS|ETSY).*', 'Jewellery');
            categorise(row, '.*(MYER|RIVERS).*', 'Clothing');
            categorise(row, '.*(CALTEX).*', 'Fuel');
            categorise(row, '.*(UBER).*', 'Ridesharing');
            categorise(row, '.*(Broadband|IINET).*', 'Internet');
            categorise(row, '.*(PHARMACY|HEALTH|PHYSIO|Obgyn|PHILIP ROWLANDS|TERRY WHITE).*', 'Health');
            categorise(row, '.*PARK.*', 'Parking');
            categorise(row, '.*(Vet|VET|PET).*', 'Pet');
            categorise(row, '.*(SYNERGY).*', 'Utilities');
          });

          this.header = header;
          this.data = results.data; //.filter((row) => !!row.Category);

          let categories = _.groupBy(this.data, 'Category');
          let categoryArray = [];
          this.donutData = []
          for (let key in <any>categories) {
            this.donutData.push({
              label: key === 'undefined' ? 'Other' : key,
              value: Math.round(_.sumBy(
                categories[key].map((r: any) => ({
                  ...r,
                  Debit: parseFloat(r.Debit) || 0,
                })),
                'Debit',
              )),
            });
          }
        },
      });
    },
    colour(row: any) {
      return row['Narration'] && row.Category ? 'black' : 'red';
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