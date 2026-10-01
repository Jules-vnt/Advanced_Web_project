<template>
  <div>
    <PageHeader
      title="Logout"
      description="End your session on this device."
      icon="bi-box-arrow-right"
      :image="image"
      image-alt="Two hands holding a small green plant"
    />
    <ComingSoon title="Sign-out is on its way" icon="bi-box-arrow-right">
      Once authentication is connected, this page will close your session.
    </ComingSoon>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import ComingSoon from '@/components/ComingSoon.vue'
import image from '@/assets/img/account.jpg'

export default {
  name: 'LogoutView',
  components: { PageHeader, ComingSoon },
  data() {
    return { image }
  }
}
</script>
