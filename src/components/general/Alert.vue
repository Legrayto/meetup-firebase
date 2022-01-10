<template>
	  <v-alert
      type='error'
      dismissible
			dense
			@input='onClose'
    >
			{{text}}
		</v-alert>
</template>

<script>
	export default {
		props: ['text'],
		methods: {
			onClose() {
					this.$emit('dismissible')
				}
			}
		}
</script>