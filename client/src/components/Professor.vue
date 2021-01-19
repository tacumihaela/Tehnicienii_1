<template>
  <div>
    <div class="q-pa-md">
      <q-table title="All projects" :data="all" :columns="columns" row-key="id">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="accent"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>

            <q-td key="projectName" :props="props">
              {{ props.cols.find((col) => col.name == "projectName").value }}
            </q-td>
            <q-td key="noDeliverables" :props="props">
              {{ props.cols.find((col) => col.name == "noDeliverables").value }}
            </q-td>
            <q-td key="total" :props="props">
              {{ props.cols.find((col) => col.name == "total").value }}
            </q-td>
            <q-td key="deliverables" :props="props">
              <q-btn @click="selectDetails(props.row)">View</q-btn>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <p>
                  Description:<b> {{ props.row.description }}</b>
                </p>
                <q-tree
                  class="col"
                  :nodes="projectTree(props.row.users)"
                  node-key="label"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-dialog ref="dialog" @hide="onDialogHide">
      <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw">
        <q-table
          title="Deliverables"
          :data="selected.deliverables"
          :columns="deliverablesColumns"
          row-key="id"
        >
          <template v-slot:body-cell-source="props">
            <q-td :props="props">
              <q-btn type="a" @click="goExternal(props.row.source)">Go</q-btn>
            </q-td>
          </template>
        </q-table>

        <q-card-actions align="right">
          <q-btn color="primary" label="Exit" @click="onExitClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style></style>

<script>
export default {
  name: "Professor",
  data() {
    return {
      grade: 0,
      user: {},
      selected: {},
      columns: [
        {
          name: "projectName",
          label: "Project name",
          align: "left",
          field: (row) => row.name,
          //   format: (val) => val.name,
          sortable: true,
        },
        {
          name: "noDeliverables",
          label: "No. deliverables",
          align: "left",
          field: (row) => row.deliverables,
          format: (val) => val.length,
          sortable: true,
        },
        {
          name: "total",
          label: "Grade",
          align: "left",
          field: "total",
          format: (val) => (val != -1 ? val : "N/A"),
          sortable: true,
        },
        {
          name: "deliverables",
          label: "Deliverables",
          align: "left",
        },
      ],
      deliverablesColumns: [
        {
          name: "source",
          label: "Source",
          align: "left",
        },
        {
          name: "total",
          label: "Grade",
          align: "left",
          field: "total",
          format: (val) => (val != -1 ? val : "N/A"),
          sortable: true,
        },
        {
          name: "noVotes",
          label: "No. votes",
          align: "left",
          field: (row) => row,
          format: (val) => `${val.grades.length}/${val.available}`,
          sortable: true,
        },

        {
          name: "timer",
          label: "Timer",
          align: "left",
          field: "createdAt",
          format: (val) => {
            const millis = 30 * 60 * 1000 + Date.parse(val) - Date.now();
            console.log(val, millis);
            if (millis < 0) return "N/A";

            const minutes = Math.floor(millis / 60000);
            const seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
          },
          sortable: true,
        },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: "createdAt",
          format: (val) => {
            const millis = 30 * 60 * 1000 + Date.parse(val) - Date.now();
            if (millis < 0) return "Expired";
            else return "Active";
          },
          sortable: true,
        },
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
      ],
    };
  },
  beforeMount() {
    this.user = this.$q.localStorage.getItem("user");
    if (!this.user) {
      this.$router.push("/auth");
    } else {
      this.$store.dispatch("data/loadProjects");
      this.$store.dispatch("data/loadAll");
    }
  },
  methods: {
    setGrade(grade) {
      console.log(grade);
      this.grade = grade;
    },
    goExternal(url) {
      window.open(url, "_blank");
    },
    saveGrade(deliverableId) {
      this.$axios
        .put("/api/grades", {
          value: Number(this.grade).toFixed(2),
          deliverableId,
        })
        .then((response) => {
          this.$q.notify({
            color: "primary",
            message: response.data.message,
          });

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
    projectTree(users) {
      if (!users) return [];
      return [
        {
          label: "Students",
          icon: "share",

          children: users.map((item) => {
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
    },
    selectDetails(item) {
      this.selected = item;
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onExitClick() {
      // we just need to hide dialog
      this.hide();
    },
  },
  computed: {
    projects() {
      return this.$store.getters["data/getProjects"];
    },
    grades() {
      return this.$store.getters["data/getGrades"];
    },
    all() {
      return this.$store.getters["data/getAll"];
    },
  },
};
</script>
