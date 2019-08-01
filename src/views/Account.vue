<template>
  <div>This is Account page, your account is {{accountId}}</div>
</template>

<script>
export default {
  props: {
    accountId: {
      type: String
    }
  }
};
</script>
