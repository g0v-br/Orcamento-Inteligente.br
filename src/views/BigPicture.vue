<template>
    <div>this is big picture page, PARTITION: {{partitionId}} </div>
</template>

<script>
export default {
  props: {
    partitionId: {
      type: String,
      default: "bigPicture"
    }
  }
};
</script>