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

import * as _ from 'lodash';

import Papa from 'papaparse';

enum Category {
  Rent = 'Rent',
  CouncilRates = 'Rates',
  Utilities = 'Utilities',
  PhoneTV = 'Phone/TV/Internet',
  Groceries = 'Groceries',
  Health = 'Health',
  FoodEntertainment = 'Food & Entertainment',
  ChildCare = 'Child Care',
  School = 'School/Tuition',
  ClothingBooksGifts = 'Clothing/Books/Gifts',
  Transport = 'Transport',
  Insurance = 'Insurance',
  Charity = 'Charity',
  Other = 'Other',
}

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
      donutData: [],
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
    async loadCSV() {

      Papa.parse('/CreditCard_transaction_27_05_2019.csv', {
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

          header['SubCategory'] = {
            title: 'SubCategory',
            slot: 'coloured',
          };

          let categorise = (row: any, filter: string, category: Category, subcategory: string) => {
            if (!row.Narration || row.Category) return;

            if (new RegExp(filter).test(row.Narration) || new RegExp(filter).test(this.narrationMap[row.Narration])) {
              row.Category = category.toString();
              row.SubCategory = subcategory;
            }
          };

          results.data.forEach((row) => {
            categorise(
              row,
              '.*(CHEMIST|Radiology|PLINE|PHARMACY|MASSAGE|HEALTH|PHYSIO|Obgyn|PHILIP ROWLANDS|TERRY WHITE|WALGREENS|ARMANDO CHIERA|JASON KIELY|FOOT HAVEN).*',
              Category.Health,
              'Medical',
            );
            categorise(
              row,
              '.*(KMART|RED DOT|BUNNINGS|BEST & LESS|HOME|TARGET|BIG W).*',
              Category.ClothingBooksGifts,
              'House',
            );
            categorise(
              row,
              '.*(Amazon Go|SPUDSHED|COLES|WOOLWORTHS|ALDI|IGA|BAKERY|MR FRESH|VEEOS|FRESH|Fresh|ORIENTAL).*',
              Category.Groceries,
              'Groceries',
            );
            categorise(
              row,
              '.*(RAW N REAL|PAYSTAY|GAME CITY|ESPRESSO|Hylin|MAGDIEL|Filter & Fare|CAFE|Caffe|DELAWARE NORTH|Muzz Buzz|MAX AND SONS|LOWDOWN|ALH GROUP|UMA VIDA|YELO|KRUSTYKOB|COFFEE|HOLMES AND CO|96 Express|Holiday Inn City Centr|Coffee|GHIASSI|UTOPIA|Voodoo).*',
              Category.FoodEntertainment,
              'Coffee',
            );
            categorise(
              row,
              '.*(GANPING LIN|HJ |BENANDJERRY|HOLEY MOLEY|MASS/INJ|INDIAN|HISS & SMOKE|Isle Of Voyage|THAI|MAD MEX|KFC|UNCLE JOES|DOMINOS|BBQ|SATAY|ZAMBRERO|CHIMEK|TOKYO STATION|LEEDERVILLE FOODS|DJ COMBINE|COLD ROCK|Jesters Pies|GREEKFELLAS|iL Tavolo Rustico|VASHNAV|CHINESE|ZHONG LIANG|GHIRARDELLI|Menulog|BOUDIN|KEBAB|BOOST JUICE|SHY JOHN|GRILLD|SUBWAY|GREENHORNS|SUN KWONG|SUNNYSIDE UP|JAPANESE|SUSHI|FRO YO|MCDONALDS|PHETCHABURA|HAWELI|WILD FIG|MEET AND BUN|KITCHEN|Tim Ho Wan|BURGER).*',
              Category.FoodEntertainment,
              'Take-out',
            );
            categorise(row, '.*(REBEL|HBF RUN|SPORTS|GOOD LIFE).*', Category.Health, 'Sport');
            categorise(row, '.*(HAIR|BARBER|NAILS|Threading).*', Category.Other, 'Hair/Makeup');
            categorise(
              row,
              '.*(LIQUOR|DAN MURPHYS|STREET EATS|BEAUMONDE|BANKWEST FOUNDATION).*',
              Category.FoodEntertainment,
              'Alcohol',
            );
            categorise(row, '.*(INSURANCE).*', Category.Insurance, 'Insurance');
            categorise(row, '.*(NETFLIX).*', Category.PhoneTV, 'TV');
            categorise(row, '.*(POST).*', Category.ClothingBooksGifts, 'Office');
            categorise(row, '.*(BIRTHS DEATHS).*', Category.ClothingBooksGifts, 'Office');
            categorise(row, '.*(BOOKS|AMAZON MKTPLC|BOOKDEPO|TREASA).*', Category.ClothingBooksGifts, 'Books');
            categorise(row, '.*(GFP BABIES).*', Category.Other, 'Photos');
            categorise(row, '.*(EBAY).*', Category.Other, 'eBay');
            categorise(row, '.*(TELSTRA|OPTUS|AT&T).*', Category.PhoneTV, 'Mobile');
            categorise(row, '.*(LATITUDE|PROUDS|ETSY).*', Category.ClothingBooksGifts, 'Jewellery');
            categorise(
              row,
              '.*(MYER|RIVERS|SHOEMEN|WITCHERY|SUSSAN|MILLERS|WATERTOWN).*',
              Category.ClothingBooksGifts,
              'Clothing',
            );
            categorise(row, '.*(Vehicle).*', Category.Transport, 'Car');
            categorise(row, '.*(CALTEX).*', Category.Transport, 'Fuel');
            categorise(row, '.*(UBER).*', Category.Transport, 'Ridesharing');
            categorise(row, '.*(TRANSPERTH).*', Category.Transport, 'Public Transport');
            categorise(row, '.*(Broadband|BROADBAND|IINET).*', Category.PhoneTV, 'Internet');
            categorise(row, '.*(PARK|CPP).*', Category.Transport, 'Parking');
            categorise(row, '.*(Vet|VET|PET).*', Category.Health, 'Pet');
            categorise(row, '.*(SYNERGY).*', Category.Utilities, 'Utilities');
            categorise(row, '.*(HYATT|OAKLAND|SAN FRANCISCO|AIRPORT|SAUSALITO).*', Category.Other, 'Travel');
            categorise(row, '.*(OPEN DOOR).*', Category.Charity, 'Charity');

            categorise(row, '.*(ENTERTAINMENT).*', Category.FoodEntertainment, 'Entertainment');

            categorise(row, '.*(SQ *).*', Category.FoodEntertainment, 'Food');
            categorise(row, '.*(PAYPAL|Groupon).*', Category.Other, 'Online Shopping');
          });

          this.header = header;
          this.data = results.data; //.filter((row) => !row.Category);

          let categories = _.groupBy(this.data, 'Category');
          let categoryArray = [];
          this.donutData = [];
          for (let key in <any>categories) {
            this.donutData.push({
              label: key === 'undefined' ? 'Other' : key,
              value: Math.round(
                _.sumBy(
                  categories[key].map((r: any) => ({
                    ...r,
                    Debit: parseFloat(r.Debit) || 0,
                  })),
                  'Debit',
                ),
              ),
            });
          }
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