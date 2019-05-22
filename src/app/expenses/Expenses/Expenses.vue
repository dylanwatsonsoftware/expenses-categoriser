<template>
  <div :class="$style.expenses">
    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">Expenses</vue-headline>
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

export default {
  metaInfo:   {
    title: 'Expenses',
  },
  components: {
    VueGrid,
    VueGridItem,
    VueButton,
    VueGridRow,
    VueHeadline,
  },
  methods: {
    ...mapActions('expenses', ['increment', 'decrement']),
  },
  computed: {
    ...mapGetters('expenses', ['count', 'incrementPending', 'decrementPending']),
  },
  beforeCreate() {
    registerModule('expenses', ExpensesModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('expenses', ExpensesModule);
    return options.store.dispatch('expenses/increment');
  },
};
</script>

<style lang="scss" module>
@import "~@/app/shared/design-system";

.expenses {
  margin-top: $nav-bar-height;
  min-height: 500px;
}
</style>