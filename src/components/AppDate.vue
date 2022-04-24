<template>
  <span :title="formatedDate">
    {{ timeFromNow }}
  </span>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export default {
  props: {
    timestamp: {
      type: Number,
      required: true
    }
  },

  computed: {
    formatedDate() {
      return dayjs.unix(this.timestamp).format('llll')
    },

    timeFromNow() {
      return dayjs.unix(this.timestamp).fromNow()
    }
  }
}
</script>

<style>

</style>
