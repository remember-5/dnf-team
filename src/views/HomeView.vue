<template>
  <n-grid cols="3" item-responsive responsive="screen">
    <n-grid-item span="0 m:1 l:2">
      <div class="light-green">
        <div v-for="(item, index) in groupArray" :key="index" class="group-box">
          <span>队伍{{ index + 1 }}信息</span>
          <draggable
            class="group-draggable"
            id="first"
            data-source="juju"
            :list="item"
            group="a"
            item-key="name"
            @change="saveLocalStorage"
          >
            <template #item="{ element }">
              <div class="list-group-item">
                <n-avatar size="30" :src="element.avatar" />
                <div>
                  <n-gradient-text type="error">
                    id: {{ element.account }}
                  </n-gradient-text>
                  <n-gradient-text type="info">
                    名望: {{ element.reputation }}
                  </n-gradient-text>
                </div>
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
        <div style="float: right">
          <n-button type="info" @click="addGroup">添加队伍</n-button>
        </div>
      </div>
    </n-grid-item>
    <n-grid-item>
      <div class="green">
        <span>职业列表</span>
        <draggable
          :list="heroStore.heroArray"
          class="hero-box"
          group="a"
          item-key="name"
          @change="saveLocalStorage"
        >
          <template #item="{ element }">
            <div class="list-group-item item">
              <n-avatar size="30" :src="element.avatar" />
              <div>
                <n-gradient-text type="error">
                  id: {{ element.account }}
                </n-gradient-text>
                <n-gradient-text type="info">
                  名望: {{ element.reputation }}
                </n-gradient-text>
              </div>
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
        <div class="btn-box">
          <n-button size="large" type="info" @click="this.showModal = true">
            新增
          </n-button>
          <n-button size="large" type="primary" @click="inputModal = true">
            导入
          </n-button>
          <n-button size="large" type="warning" @click="exportData"
            >导出</n-button
          >
          <n-button size="large" type="error" @click="resetInputJob">
            重置并清除缓存
          </n-button>
        </div>
      </div>
    </n-grid-item>
  </n-grid>

  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
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

  <n-modal v-model:show="inputModal" preset="dialog" title="Dialog">
    <template #header>
      <div>导入数据</div>
    </template>
    <n-input
      v-model:value="inputData"
      type="textarea"
      style="height: 300px"
      placeholder="复制json到这里"
    />
    <template #action>
      <n-button attr-type="button" @click="inputJsonData">保存</n-button>
    </template>
  </n-modal>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { jobs } from "@/utils/hero.js";
import draggable from "vuedraggable";

import { heroStore } from "@/stores/counter";
import { mapStores } from "pinia"; // npm i file-saver
export default defineComponent({
  name: "dnf-team",
  display: "编队小组首",
  order: 14,
  components: {
    draggable,
  },
  data() {
    return {
      // 职业列表，tree需要
      jobs: jobs,
      // 选中的职业
      selectJob: reactive([]),
      showModal: false,
      inputModal: false,
      inputData: "",
      formValue: reactive({
        user: {
          job: "", // 职业
          reputation: "", // 名望
          account: "", // 玩家id
          dps: "", // 输出
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
    };
  },
  setup() {
    heroStore().getLocalStorage();
  },
  computed: {
    ...mapStores(heroStore),
    groupArray() {
      return this.heroStore.groupArray;
    },
    heroArray() {
      return this.heroStore.heroArray;
    },
  },
  methods: {
    addGroup() {
      this.heroStore.appendGroup([]);
      this.saveLocalStorage();
    },
    saveLocalStorage() {
      this.heroStore.saveLocalStorage();
    },
    // 保存职业
    saveJob() {
      let hero = {
        ...this.selectJob,
        ...this.formValue.user,
      };
      this.heroStore.appendHero(hero);
      this.selectJob = "";
      this.formValue.user = {};
      this.showModal = false;
      this.saveLocalStorage();
    },
    updateJob(value, option) {
      this.selectJob = option;
    },
    inputJsonData() {
      this.heroStore.inputJsonData(this.inputData);
      this.inputModal = false;
    },
    exportData() {
      this.heroStore.exportJsonData();
    },
    resetInputJob() {
      this.heroStore.resetData();
    },
  },
});
</script>

<style scoped="scoped">
.light-green {
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  background-color: rgba(0, 128, 0, 0.24);
}

.group-box {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 15px;
}
.group-draggable {
  border-style: solid;
  padding: 10px;
  height: 120px;
  display: flex;
}
.hero-box {
  border-style: solid;
  display: flex;
}
</style>
