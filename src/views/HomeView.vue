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
                  &nbsp;
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
          :list="heroArray"
          class="hero-box"
          group="a"
          item-key="name"
          @change="saveLocalStorage"
        >
          <template #item="{ element, index }">
            <div
              class="list-group-item item"
              @click="clickHero(index, element)"
            >
              <n-avatar size="30" :src="element.avatar" />
              <div>
                <n-gradient-text type="error">
                  id: {{ element.account }}
                </n-gradient-text>
                &nbsp;
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
          <n-button size="large" type="info" @click="this.heroModal = true">
            新增
          </n-button>
          <n-button size="large" type="primary" @click="inputDataModal = true">
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

  <n-modal
    v-model:show="heroModal"
    preset="dialog"
    title="Dialog"
    @after-leave="clearHero"
  >
    <template #header>
      <div>添加职业</div>
    </template>

    <div>
      <n-form
        ref="formRef"
        label-width="auto"
        :model="hero"
        label-placement="left"
        :rules="rules"
        :style="{
          maxWidth: '640px',
        }"
      >
        <n-form-item label="职业" path="label">
          <n-tree-select
            :options="jobs"
            :default-value="hero.key"
            placeholder="选择职业"
            :disabled="isEditState"
            @update:value="updateJob"
          />
        </n-form-item>
        <n-form-item label="玩家id" path="account">
          <n-input v-model:value="hero.account" placeholder="玩家id" />
        </n-form-item>
        <n-form-item label="名望" path="reputation">
          <n-input v-model:value="hero.reputation" placeholder="输入名望" />
        </n-form-item>
        <n-form-item label="伤害/奶量" path="dps">
          <n-input v-model:value="hero.dps" placeholder="输入伤害/奶量" />
        </n-form-item>
      </n-form>
    </div>
    <template #action>
      <n-button attr-type="button" @click="saveHero">保存</n-button>
    </template>
  </n-modal>

  <n-modal v-model:show="inputDataModal" preset="dialog" title="Dialog">
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
import { jobArray } from "@/utils/hero.js";
import draggable from "vuedraggable";

import { heroStore } from "@/stores/counter";
import { mapStores } from "pinia"; // npm i file-saver
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "dnf",
  display: "asd",
  order: 14,
  components: {
    draggable,
  },
  data() {
    return {
      // 职业列表，tree需要
      jobs: reactive(jobArray),
      hero: reactive({
        label: "",
        job: "", // 职业
        reputation: "", // 名望
        account: "", // 玩家id
        dps: "", // 输出
      }),
      // 是否是编辑状态
      isEditState: false,
      // heroGroup选中的index
      heroArraySelectIndex: 0,
      heroModal: false,
      inputDataModal: false,
      // 导入的json
      inputData: "",
      rules: reactive({
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
    },
    saveLocalStorage() {
      this.heroStore.saveLocalStorage();
    },
    // 保存职业
    saveHero() {
      // 编辑状态
      if (this.isEditState) {
        this.heroStore.editHeroArray(this.heroArraySelectIndex, this.hero);
      } else {
        this.heroStore.appendHero(this.hero);
      }
      this.isEditState = false;
      this.hero = {};
      this.heroModal = false;
      this.saveLocalStorage();
    },
    clickHero(index, data) {
      this.heroArraySelectIndex = index;
      this.hero = { ...this.hero, ...data };
      this.isEditState = true;
      this.heroModal = true;
    },
    // 点击关闭按钮，清楚状态
    clearHero() {
      this.isEditState = false;
      this.hero = {};
    },
    updateJob(index, job) {
      console.log(job);
      this.hero = { ...this.hero, ...job };
    },
    inputJsonData() {
      this.heroStore.inputJsonData(this.inputData);
      this.inputDataModal = false;
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
  min-height: 300px;
  border-style: solid;
  display: flex;
}
</style>
