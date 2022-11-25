<script>
import { defineComponent, reactive } from "vue";
import { jobs } from "@/utils/hero.js";
import draggable from "vuedraggable";
import localdb from "@/utils/localstorage.js";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "dnf编队",
  display: "Two list header slot",
  order: 14,
  components: {
    draggable,
  },
  data() {
    return {
      // 职业列表，tree需要
      jobs: jobs,
      // 用户输入的职业
      inputList: [],
      // 选中的职业
      selectJob: reactive([]),
      showModal: false,
      formValue: reactive({
        user: {
          job: "",
          reputation: "",
          account: "",
          dps: "",
        },
      }),
      rules: reactive({
        user: {
          account: {
            required: true,
            message: "请输入玩家id",
            trigger: "blur",
          },
          reputation: {
            required: true,
            message: "请输入名望",
            trigger: ["input", "blur"],
          },
          dps: {
            required: true,
            message: "输入伤害/奶量",
            trigger: ["input", "blur"],
          },
        },
      }),
      groups: reactive({}),
      groupsIndex: 1,
    };
  },
  created() {
    this.inputList = localdb.get("inputList", []);
    this.groups = localdb.get("groups", reactive({}));
    this.groupsIndex = localdb.get("groupsIndex", 0);
  },
  methods: {
    addGroup() {
      const key = `list${this.groupsIndex}`;
      this.groups[key] = [];
      this.groupsIndex++;
    },
    saveLocalStorage() {
      localdb.save("inputList", this.inputList);
      localdb.save("groups", this.groups);
      localdb.save("groupsIndex", this.groupsIndex);
    },
    // 保存职业
    saveJob() {
      let job = {
        ...this.selectJob,
        ...this.formValue.user,
      };
      this.inputList.push(job);
      this.selectJob = "";
      this.formValue.user = {};
      this.showModal = false;
    },
    updateJob(value, option) {
      this.selectJob = option;
    },
    resetInputJob() {
      localdb.remove("inputList");
      localdb.remove("groups");
      // localdb.remove("groupsIndex");
      this.inputList = [];
      this.groups = [];
      // this.groupsIndex = 1;
    },
  },
});
</script>

<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <n-layout>
        <!--        <n-layout-header>颐和园路</n-layout-header>-->
        <n-layout-content content-style="padding: 20px;">
          <div v-for="(item, key, index) in groups" :key="key">
            <h3>队伍{{ index + 1 }}信息</h3>
            <draggable
              id="first"
              data-source="juju"
              :list="item"
              class="list-group"
              group="a"
              item-key="name"
              style="border-style: solid; height: 100px; display: flex"
            >
              <template #item="{ element }">
                <div class="list-group-item">
                  <n-avatar size="30" :src="element.avatar" />
                  <p>id: {{ element.account }}</p>
                </div>
              </template>
              <!--              <template #item="{ element }">-->
              <!--                <n-popover trigger="hover" :delay="500" :duration="500">-->
              <!--                  <template #trigger>-->
              <!--                    <div class="list-group-item">-->
              <!--                      <n-avatar size="48" :src="element.avatar" />-->
              <!--                      {{ element.account }}-->
              <!--                    </div>-->
              <!--                  </template>-->
              <!--                  <span>-->
              <!--                    <p>职业: {{ element.label }}</p>-->
              <!--                    <p>名望: {{ element.reputation }}</p>-->
              <!--                    <p>伤害/奶量: {{ element.dps }}</p>-->
              <!--                  </span>-->
              <!--                </n-popover>-->
              <!--              </template>-->
            </draggable>
          </div>
          <n-button @click="addGroup">添加队伍</n-button>
        </n-layout-content>
        <!--        <n-layout-footer>成府路</n-layout-footer>-->
      </n-layout>
      <n-layout-sider content-style="padding: 20px;">
        <div>
          <h3>职业列表</h3>

          <draggable
            :list="inputList"
            class="list-group"
            group="a"
            item-key="name"
            style="border-style: solid; height: 100px"
          >
            <template #item="{ element }">
              <div class="list-group-item item">
                <n-avatar size="48" :src="element.avatar" />
                {{ element.account }}
              </div>
            </template>

            <template #header>
              <div
                class="btn-group list-group-item"
                role="group"
                aria-label="Basic example"
              ></div>
            </template>
          </draggable>
          <n-space style="padding: 30px">
            <n-button-group vertical>
              <n-button @click="this.showModal = true"> 新增 </n-button>
              <n-button type="primary" @click="saveLocalStorage">
                保存到缓存
              </n-button>
              <n-button type="warning" @click="resetInputJob">
                重置并清除缓存
              </n-button>
            </n-button-group>
          </n-space>
        </div>
      </n-layout-sider>
    </n-layout>

    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="Dialog"
      class="job-box"
    >
      <template #header>
        <div>添加职业</div>
      </template>

      <div>
        <n-form
          ref="formRef"
          label-width="auto"
          :model="formValue"
          label-placement="left"
          :rules="rules"
          :style="{
            maxWidth: '640px',
          }"
        >
          <n-form-item label="职业" path="user.job">
            <n-tree-select
              :options="jobs"
              default-value=""
              @update:value="updateJob"
            />
          </n-form-item>
          <n-form-item label="玩家id" path="user.account">
            <n-input
              v-model:value="formValue.user.account"
              placeholder="玩家id"
            />
          </n-form-item>
          <n-form-item label="名望" path="user.reputation">
            <n-input
              v-model:value="formValue.user.reputation"
              placeholder="输入名望"
            />
          </n-form-item>
          <n-form-item label="伤害/奶量" path="user.dps">
            <n-input
              v-model:value="formValue.user.dps"
              placeholder="输入伤害/奶量"
            />
          </n-form-item>
        </n-form>
      </div>
      <template #action>
        <n-button attr-type="button" @click="saveJob">保存</n-button>
      </template>
    </n-modal>
  </n-space>
</template>

<style scoped="scoped">
.job-box {
  width: 300px;
}
</style>
