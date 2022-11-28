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
            v-model="groupArray[index]"
            group="a"
            item-key="name"
            @change="groupArrayChange(index, $event)"
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
          @change="heroArrayChange"
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

        <div style="padding-top: 30px">
          <p>暂时只支持`职业列表`的修改和删除</p>
          <p>点击职业头像，即可进入编辑模式</p>
          源码前往->
          <n-button strong secondary type="tertiary" @click="toGithub">
            Github
          </n-button>
          <n-input v-model:value="text"></n-input>
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
      <n-button
        v-if="isEditState"
        attr-type="button"
        type="error"
        @click="deleteHero"
        >删除</n-button
      >
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

import { yjsstore } from "./yjs-store.js";
import * as Vue from "vue";
import { enableVueBindings } from "@syncedstore/core";

import { jobArray } from "@/utils/hero.js";
import draggable from "vuedraggable";

import { heroStore } from "@/stores/counter";
import { mapStores } from "pinia"; // npm i file-saver

// make SyncedStore use Vuejs internally
enableVueBindings(Vue);

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
      text: "",
      yjsstore,
      // groupArray: [],
      // heroArray: [],
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
  setup() {},
  created() {
    // this.groupArray = yjsstore.groupArray;
    // this.heroArray = yjsstore.heroArray;
  },
  watch: {},
  mounted() {
    // this.$nextTick(() => {
    //   this.groupArray = JSON.parse(JSON.stringify(this.yjsstore.groupArray));
    //   this.heroArray = JSON.parse(JSON.stringify(this.yjsstore.heroArray));
    // });
  },
  computed: {
    ...mapStores(heroStore),
    groupArray: {
      get() {
        this.heroStore.$patch({
          groupArray: JSON.parse(JSON.stringify(this.yjsstore.groupArray)),
        });
        return JSON.parse(JSON.stringify(this.yjsstore.groupArray));
      },
    },
    heroArray: {
      get() {
        this.heroStore.$patch({
          heroArray: JSON.parse(JSON.stringify(this.yjsstore.heroArray)),
        });
        return JSON.parse(JSON.stringify(this.yjsstore.heroArray));
      },
    },
  },
  methods: {
    addGroup() {
      this.yjsstore.groupArray.push([]);
    },
    // 保存职业
    saveHero() {
      // 编辑状态
      if (this.isEditState) {
        this.heroArray[this.heroArraySelectIndex] = this.hero;
        this.yjsstore.heroArray.splice(this.heroArraySelectIndex, 1, this.hero);
      } else {
        this.yjsstore.heroArray.push(this.hero);
      }
      this.resetHero();
    },
    resetHero() {
      this.isEditState = false;
      this.hero = {};
      this.heroModal = false;
    },
    clickHero(index, data) {
      this.heroArraySelectIndex = index;
      this.hero = { ...this.hero, ...data };
      this.isEditState = true;
      this.heroModal = true;
    },
    deleteHero() {
      // this.heroStore.deleteHero(this.heroArraySelectIndex);
      this.yjsstore.heroArray.splice(this.heroArraySelectIndex, 1);
      this.resetHero();
    },
    // 点击关闭按钮，清楚状态
    clearHero() {
      this.isEditState = false;
      this.hero = {};
    },
    updateJob(index, job) {
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
    toGithub() {
      window.location.href = "https://github.com/remember-5/dnf-team";
    },
    groupArrayChange(index, event) {
      console.log("groupArrayChange", event, index);
      if (event.added) {
        console.log("added");
        const newIndex = event.added.newIndex;
        const element = event.added.element;
        this.yjsstore.groupArray[index].splice(newIndex, 0, element);
      }
      if (event.removed) {
        console.log("removed");
        const oldIndex = event.removed.oldIndex;
        this.yjsstore.groupArray[index].splice(oldIndex, 1);
      }
      if (event.moved) {
        console.log("moved");
        const newIndex = event.moved.newIndex;
        const oldIndex = event.moved.oldIndex;
        const newData = JSON.parse(
          JSON.stringify(this.yjsstore.groupArray[index][newIndex])
        );
        const oldData = JSON.parse(
          JSON.stringify(this.yjsstore.groupArray[index][oldIndex])
        );
        console.log("newData", newData);
        console.log("oldData", oldData);
        this.yjsstore.groupArray[index].splice(newIndex, 1, oldData);
        this.yjsstore.groupArray[index].splice(oldIndex, 1, newData);
      }

      //
      // this.heroStore.saveLocalStorage();
    },
    heroArrayChange(event) {
      console.log("heroArrayChange", event);
      if (event.added) {
        console.log("added");
        const newIndex = event.added.newIndex;
        const element = event.added.element;
        this.yjsstore.heroArray.splice(newIndex, 0, element);
        console.log("removed");
      }
      if (event.removed) {
        const oldIndex = event.removed.oldIndex;
        this.yjsstore.heroArray.splice(oldIndex, 1);
        console.log("removed");
      }
      if (event.moved) {
        console.log("moved");
        const newIndex = event.moved.newIndex;
        const oldIndex = event.moved.oldIndex;
        const newData = JSON.parse(
          JSON.stringify(this.yjsstore.heroArray[newIndex])
        );
        const oldData = JSON.parse(
          JSON.stringify(this.yjsstore.heroArray[oldIndex])
        );
        console.log("newData", newData);
        console.log("oldData", oldData);
        this.yjsstore.heroArray.splice(newIndex, 1, oldData);
        this.yjsstore.heroArray.splice(oldIndex, 1, newData);
      }
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
