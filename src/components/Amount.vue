<template>
  <span>
    {{ normalize }}
  </span>
</template>

<script>
import numeral from "numeral";

let numeral;

export default {
  name: "Amount",
  props: {
    amount: {
      type: [String, Number],
      default: Infinity
    },
    format: {
      type: String,
      default: Configuration.current().amountFormat
    }
  },
  created() {
    numeral = numeralInit(BudgetStore.state.meta.um);
  },
  computed: {
    normalize() {
      let amt = Number(this.amount);
      if (isFinite(amt)) {
        return numeral(amt).format(this.format);
      }
      return "N/A";
    }
  }
};


let umIsSetted = false;

function init() {
  if (!umIsSetted) {
    numeral.register("locale", "it", {
      delimiters: {
        thousands: ".",
        decimal: ","
      },
      abbreviations: {
        thousand: "mila",
        million: "milioni",
        billion: "miliardi",
        trillion: "trilioni"
      },
      ordinal: function(number) {
        return "º";
      },
      currency: {
        symbol: um
      }
    });
    numeral.locale(Configuration.current().locale);
    umIsSetted = true;
  }

  return numeral;
}
// import 'numeral/locales';

export default init;
</script>