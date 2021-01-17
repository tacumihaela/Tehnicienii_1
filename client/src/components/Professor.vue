<template>
  <div>
    <div class="q-pa-md">
      <q-table
        title="Grade other projects"
        :data="grades"
        :columns="columns"
        row-key="id"
      >
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
            <q-td key="source" :props="props">
              <q-btn type="a" @click="goExternal(props.row.source)">Go</q-btn>
            </q-td>
            <q-td key="value" :props="props">
              {{ props.cols.find((col) => col.name == "value").value }}
              <q-popup-edit
                v-model="grade"
                title="Update grade"
                buttons
                v-if="props.row.status != 'EXPIRED'"
                @before-show="setGrade(props.row.grade)"
                @hide="saveGrade(props.row.id)"
              >
                <q-input type="number" v-model="grade" filled autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="updatedAt" :props="props">
              {{ props.cols.find((col) => col.name == "updatedAt").value }}
            </q-td>
            <q-td key="status" :props="props">
              {{ props.cols.find((col) => col.name == "status").value }}
            </q-td>
            <q-td key="timer" :props="props">
              {{ props.cols.find((col) => col.name == "timer").value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                Description: {{ props.row.project.description }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style></style>

<script>
export default {
  name: "GradesStudent",
  data() {
    return {
      grade: 0,
      user: {},
      columns: [
        {
          name: "projectName",
          label: "Project name",
          align: "left",
          field: (row) => row.project.name,
          //   format: (val) => val.name,
          sortable: true,
        },
        {
          name: "source",
          label: "Source",
          align: "left",
        },
        {
          name: "value",
          label: "Grade",
          align: "left",
          field: "grade",
          format: (val) => (val ? Number(val).toFixed(2) : "N/A"),
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
          field: "status",
          sortable: true,
        },
        {
          name: "timer",
          label: "Timer",
          align: "left",
          field: "expireAt",
          format: (val) => {
            const millis = Date.parse(val) - Date.now();
            if (millis < 0) return "N/A";

            const minutes = Math.floor(millis / 60000);
            const seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
  },
  computed: {
    projects() {
      return this.$store.getters["data/getProjects"];
    },
    grades() {
      return this.$store.getters["data/getGrades"];
    },
  },
};
</script>
