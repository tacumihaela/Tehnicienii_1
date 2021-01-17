<template>
  <q-page class>
    <Header />
    <StudentInit
      @userUpdate="userUpdate"
      v-if="!user.projectId && user.type == 'student'"
    />
    <q-tabs
      v-if="user.projectId && user.type == 'student'"
      v-model="tab"
      dense
      align="justify"
      class="bg-grey-2 text-primary shadow-2"
      :breakpoint="0"
    >
      <q-tab name="my" label="My project" />
      <q-tab name="other" label="Other projects" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      v-if="user.projectId && user.type == 'student'"
    >
      <q-tab-panel name="my">
        <Deliverables />
      </q-tab-panel>
      <q-tab-panel name="other">
        <GradesStudent />
      </q-tab-panel>
    </q-tab-panels>

    <Professor v-if="user.type == 'professor'" />
  </q-page>
</template>

<style></style>

<script>
import Header from "components/Header";
import StudentInit from "components/StudentInit";
import Deliverables from "components/Deliverables";
import GradesStudent from "components/GradesStudent";
import Professor from "../components/Professor.vue";
export default {
  name: "MainPage",
  components: { Professor, Header, StudentInit, GradesStudent, Deliverables },
  data() {
    Professor;
    return {
      user: {},
      state: "VIEW",
      tab: "my",
    };
  },
  beforeMount() {
    this.user = this.$q.localStorage.getItem("user");
    if (!this.user) {
      this.$router.push("/auth");
    }
  },
  methods: {
    userUpdate() {
      this.user = this.$q.localStorage.getItem("user");
    },
  },
  computed: {},
};
</script>
