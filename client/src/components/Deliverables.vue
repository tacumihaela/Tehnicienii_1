<template>
  <div>
    <div class="row">
      <div class="col" v-if="project">
        <p class="text-h5">
          <span class="text-weight-bolder">{{ project.name }}</span>
        </p>
        <p class="text-subtitle1">{{ project.description }}</p>
      </div>
      <q-tree class="col" :nodes="projectTree" node-key="label" />
    </div>

    <q-table
      title="Deliverables"
      :data="deliverables"
      :columns="columns"
      responsive
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="col text-h6">Deliverables</div>
        <div class="col">
          <p v-if="isEdit">Time left for the last deliverable: {{ counter }}</p>
        </div>
        <div class="col">
          <q-btn
            :label="isEdit ? 'Edit' : 'Create'"
            color="primary"
            filled
            @click="onEdit"
            class="float-right q-mb-md"
          />
        </div>
      </template>

      <template v-slot:body-cell-source="props">
        <q-td :props="props">
          <q-btn type="a" @click="goExternal(props.row.source)">Go</q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="card" style="width: 60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" v-if="!isEdit">Add deliverable</div>
          <div class="col-3 text-grey" v-else>Edit deliverable</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Source:</div>
            <q-input
              class="col-9"
              outlined
              v-model="source"
              dense
              type="url"
              hint="URL"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="around">
            <q-btn
              icon="language"
              outline
              color="primary"
              @click="executeUpdateDeliverable"
              >{{ isEdit ? "Edit" : "Add" }}</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style></style>

<script>
export default {
  name: "Deliverables",
  data() {
    return {
      interval: {},
      user: {},
      source: "",
      card: false,
      counter: "",
      columns: [
        {
          name: "createdAt",
          label: "Created at",
          align: "left",
          field: "createdAt",
          format: (val) => {
            const date = new Date(val);
            console.log();
            return date.toLocaleString("ro-RO");
          },
          sortable: true,
        },
        {
          name: "updatedAt",
          label: "Updated at",
          align: "left",
          field: "updatedAt",
          format: (val) => {
            const date = new Date(val);
            console.log();
            return date.toLocaleString("ro-RO");
          },
          sortable: true,
        },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: "createdAt",
          format: (val) => {
            const bool = Date.now() - Date.parse(val) < 30 * 60 * 1000;
            return `${bool ? "Editable" : "Idle"}`;
          },
          sortable: true,
        },
        {
          name: "source",
          label: "Source",
          align: "left",
        },
      ],
    };
  },
  beforeMount() {
    this.user = this.$q.localStorage.getItem("user");
    if (!this.user) {
      this.$router.push("/auth");
    } else {
      this.$store.dispatch("data/loadProjects");
      this.$store.dispatch("data/loadDeliverables");
    }
  },
  created() {
    this.interval = setInterval(() => this.countDown(), 1000);
  },
  methods: {
    goExternal(url) {
      window.open(url, "_blank");
    },
    onEdit() {
      this.card = true;
    },
    executeUpdateDeliverable() {
      this.$axios
        .post("/api/projects/deliverables", { source: this.source })
        .then((response) => {
          this.$q.notify({
            color: "primary",
            message: response.data.message,
          });

          this.card = false;

          this.$store.dispatch("data/loadGrades");
          this.$store.dispatch("data/loadDeliverables");
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message,
          });
        });
    },
    countDown() {
      if (!this.isEdit) {
        clearInterval(this.interval);
        this.counter = "";
      } else {
        const millis =
          30 * 60 * 1000 -
          Date.now() +
          Date.parse(this.deliverables[0].createdAt);
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        this.counter = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.counter = "";
  },
  computed: {
    projects() {
      return this.$store.getters["data/getProjects"];
    },
    deliverables() {
      return this.$store.getters["data/getDeliverables"];
    },
    project() {
      return this.projects.find((item) => item.id == this.user.projectId);
    },

    projectTree() {
      if (!this.project) return [];
      const tree = [
        {
          label: "Students",
          icon: "share",

          children: this.project.users.map((item) => {
            return {
              avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
              label: `${item.firstName} ${item.lastName}`,

              children: [
                { label: "First name: " + item.firstName },
                { label: "Last name: " + item.lastName },
                { label: "Email: " + item.email },
              ],
            };
          }),
        },
      ];
      return tree;
    },
    isEdit() {
      if (this.deliverables && this.deliverables.length > 0) {
        const bool =
          Date.now() - Date.parse(this.deliverables[0].createdAt) <
          30 * 60 * 1000;

        if (bool) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.source = this.deliverables[0].source;
        }

        return bool;
      }
      return false;
    },
  },
};
</script>
