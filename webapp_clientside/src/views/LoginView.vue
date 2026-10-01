<template>
  <div>
    <PageHeader
      title="Login"
      description="Sign in to manage collections and treatment centers."
      icon="bi-person-circle"
      :image="image"
      image-alt="Two hands holding a small green plant"
    />
    <ComingSoon title="Sign-in is on its way" icon="bi-person-circle">
      Authentication is being wired to the server. You can still browse every section in the meantime.
    </ComingSoon>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import ComingSoon from '@/components/ComingSoon.vue'
import image from '@/assets/img/account.jpg'

export default {
  name: 'LoginView',
  components: { PageHeader, ComingSoon },
  data() {
    return { image }
  }
}
</script>
