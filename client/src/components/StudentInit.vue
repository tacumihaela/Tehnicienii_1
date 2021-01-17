<template>
  <div>
    <q-banner
      v-if="bannerProjectVisible"
      inline-actions
      class="text-white bg-red"
    >
      No project asigned, create or asign youself to an existing project in
      order to continue
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          label="Close"
          @click="bannerProjectVisible = false"
        />
      </template>
    </q-banner>

    <div class="q-pa-md">
      <q-table
        :loading="loading"
        title="Activities"
        :data="projects"
        :columns="columns"
        responsive
        row-key="id"
      >
        <template v-slot:top="props">
          <div class="col text-h6">Existing projects</div>
          <div class="col">
            <q-btn
              label="Create"
              color="primary"
              filled
              @click="onCreate"
              class="float-right q-mb-md"
            />
          </div>
        </template>

        <template v-slot:body-cell-students="props">
          <q-td :props="props">
            <q-btn @click="selectDetails(props.row)">View</q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn @click="asignToProject(props.row)">Assign</q-btn>
          </q-td>
        </template>
      </q-table>
      <q-dialog ref="dialog" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
          <q-table
            title="Students"
            :data="selected.users"
            :columns="studentColumns"
            row-key="index"
          >
          </q-table>

          <q-card-actions align="right">
            <q-btn color="primary" label="Exit" @click="onExitClick" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirmAssign" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Are you sure you want to be asigned to the project
              <b>{{ selected.name }}</b
              >.
            </span>
            <span class="q-ml-sm"
              >Team members: <b>{{ usersWithinProject }}</b
              >.
            </span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              filled
              label="Assign"
              @click="executeAssign"
              color="primary"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="card" style="width: 60%">
        <q-card class="my-card full-width">
          <q-card-section class="row text-h5 ellipsis">
            <div class="col-3 text-grey" v-if="state === 'ADD'">
              Add Project
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-mb-md">
              <div class="col-3 text-grey">Name:</div>
              <q-input
                class="col-9"
                type="text"
                outlined
                v-model="newProject.name"
                dense
                label="Name"
              />
            </div>

            <div class="row q-mb-md">
              <div class="col-3 text-grey">Description:</div>
              <q-input
                class="col-9"
                type="text"
                outlined
                v-model="newProject.description"
                dense
                label="Description"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <q-card-actions align="around">
              <q-btn
                icon="dashboard"
                outline
                color="primary"
                @click="executeAddProject"
                v-if="state === 'ADD'"
                >Add</q-btn
              >
            </q-card-actions>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<style></style>

<script>
export default {
  name: "StudentInit",
  data() {
    return {
      confirmAssign: false,
      bannerProjectVisible: true,
      user: {},
      state: "VIEW",
      tab: "my",
      card: false,
      filter: "",
      loading: true,
      newProject: {
        name: "",
        description: "",
      },
      selected: {},
      studentColumns: [
        {
          name: "firstName",
          label: "First name",
          align: "left",
          field: "firstName",
          sortable: true,
        },
        {
          name: "lastName",
          label: "Last name",
          align: "left",
          field: "lastName",
          sortable: true,
        },
        {
          name: "email",
          label: "Email",
          align: "left",
          field: "email",
          sortable: true,
        },
      ],
      columns: [
        {
          name: "name",
          label: "Name",
          align: "left",
          field: "name",
          sortable: true,
        },

        {
          name: "description",
          label: "Description",
          align: "left",
          field: "description",
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
        {
          name: "students",
          label: "Students",
          align: "left",
        },
        {
          name: "action",
          label: "Action",
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
      this.$store.dispatch("data/loadGrades");
    }
  },
  methods: {
    asignToProject(item) {
      this.selected = item;
      this.confirmAssign = true;
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
    executeAssign() {
      this.$axios
        .post("/api/projects/add", { projectId: this.selected.id })
        .then((response) => {
          this.$q.notify({
            color: "primary",
            message: response.data.message,
          });

          this.user.projectId = this.selected.id;

          this.$q.localStorage.set("user", this.user);
          this.$emit("userUpdate");
        })
        .catch((error) => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message,
          });
        });
    },
    onCreate() {
      this.card = true;
      this.state = "ADD";
    },
    executeAddProject() {
      this.$axios
        .post("/api/projects", this.newProject)
        .then((response) => {
          this.$q.notify({
            color: "primary",
            message: response.data.message,
          });

          this.user.projectId = response.data.project.id;

          this.card = false;
          this.$q.localStorage.set("user", this.user);
          this.$emit("userUpdate");
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
    usersWithinProject() {
      return this.selected.users
        ? this.selected.users
            .map((item) => item.firstName + " " + item.lastName)
            .join(", ")
        : "";
    },
  },
};
</script>
