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
      type: [Number, Object],
      required: true,
    },
  },

  computed: {
    normalizedTimeStamp() {
      return this.timestamp?.seconds || this.timestamp
    },

    formatedDate() {
      return dayjs.unix(this.normalizedTimeStamp).format('llll')
    },

    timeFromNow() {
      return dayjs.unix(this.normalizedTimeStamp).fromNow()
    },
  },
}
</script>

<style></style>
