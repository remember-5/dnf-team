<template>
  <div class="idx">
    <n-grid cols="3" item-responsive responsive="screen">
      <n-grid-item span="0 m:1 l:2">
        <div class="light-green">
          <div
            v-for="(item, groupIndex) in groupArray"
            :key="groupIndex"
            class="group-box"
          >
            <span class="troops">队伍{{ groupIndex + 1 }}信息</span>
            <draggable
              class="group-draggable"
              id="first"
              data-source="juju"
              v-model="groupArray[groupIndex]"
              group="a"
              item-key="name"
              @change="groupArrayChange(groupIndex, $event)"
            >
              <template #item="{ element, index }">
                <div
                  class="list-group-item"
                  @click="groupClickHero(groupIndex, index, element)"
                >
                  <n-avatar size="30" :src="element.avatar" />
                  <div>
                    <n-gradient-text class="renown" type="info">
                      {{ jobText(element) }}
                    </n-gradient-text>
                    <br />
                    <n-gradient-text class="idCard" type="error">
                      玩家: {{ element.account }}
                    </n-gradient-text>
                    <br />
                    <n-gradient-text class="job-item">
                      {{ dpsText(element) }}
                    </n-gradient-text>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </n-grid-item>
      <n-grid-item>
        <div class="green group-box">
          <span class="troops">职业列表</span>
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
                  <n-gradient-text class="renown" type="info">
                    {{ jobText(element) }}
                  </n-gradient-text>
                  <br />
                  <n-gradient-text class="idCard" type="error">
                    玩家: {{ element.account }}
                  </n-gradient-text>
                  <br />
                  <n-gradient-text class="job-item">
                    {{ dpsText(element) }}
                  </n-gradient-text>
                </div>
              </div>
            </template>
          </draggable>
          <div class="btn-box">
            <n-button size="large" type="info" @click="addGroup"
              >添加队伍</n-button
            >
            <n-button size="large" type="info" @click="this.heroModal = true">
              新增职业
            </n-button>
            <n-popconfirm
              @negative-click="this.guid = ''"
              @positive-click="generateShareUrl"
              negative-text="取消"
              positive-text="复制链接"
            >
              <template #trigger>
                <n-button
                  size="large"
                  type="error"
                  @click="generateGuid"
                  v-show="!enableCollaborate"
                  >开启协同</n-button
                >
              </template>
              {{ shareUrl }}
            </n-popconfirm>
            <n-button
              size="large"
              type="primary"
              @click="inputDataModal = true"
            >
              导入
            </n-button>
            <n-button size="large" type="warning" @click="exportData"
              >导出</n-button
            >
            <n-button size="large" type="error" @click="resetInputJob">
              重置并清除缓存
            </n-button>
          </div>

          <div class="words" style="padding-top: 30px">
            <p>点击职业头像，即可进入编辑模式</p>
            源码前往->
            <a href="https://github.com/remember-5/dnf-team" target="_blank"
              >Github</a
            >
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
            <n-input-number
              v-model:value="hero.reputation"
              placeholder="输入名望"
            />
          </n-form-item>
          <n-form-item label="类型" path="jobType">
            <n-radio-group v-model:value="hero.jobType" name="jobType">
              <n-space>
                <n-radio value="1"> C </n-radio>
                <n-radio value="2"> 奶 </n-radio>
                <n-radio value="3"> 混子 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item v-show="hero.jobType === '1'" label="输入伤害">
            <n-input-number v-model:value="hero.dps" placeholder="输入伤害" />
          </n-form-item>
          <n-form-item v-show="hero.jobType === '2'" label="三攻">
            <n-input-number v-model:value="hero.sangong" placeholder="三攻" />
          </n-form-item>
          <n-form-item v-show="hero.jobType === '2'" label="力智">
            <n-input-number v-model:value="hero.lizhi" placeholder="力智" />
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

    <!--  导入数据  -->
    <n-modal v-model:show="inputDataModal" preset="dialog" title="Dialog">
      <template #header>
        <div>导入数据</div>
      </template>
      <n-input
        v-model:value="inputJsonData"
        type="textarea"
        style="height: 300px"
        placeholder="复制json到这里"
      />
      <template #action>
        <n-button attr-type="button" @click="doInputJsonData">保存</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

import { yjsstore, initWebSocket } from "./yjs-store.js";
import * as Vue from "vue";
import { enableVueBindings } from "@syncedstore/core";

import { jobArray } from "@/utils/hero.js";
import draggable from "vuedraggable";

import { heroStore } from "@/stores/counter";
import { mapStores } from "pinia";
import router from "@/router"; // npm i file-saver

import useClipboard from "vue-clipboard3";
import { useNotification, useMessage } from "naive-ui";

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
      yjsstore,
      // 职业列表，tree需要
      jobs: reactive(jobArray),
      guid: "",
      hero: reactive({
        label: "",
        job: "", // 职业
        account: "", // 玩家id
        jobType: "", // 职业类型
        reputation: 0, // 名望
        dps: 0, // 输出
        sangong: 0, // 三攻
        lizhi: 0, // 力智
      }),
      // 是否是编辑状态
      isEditState: false,
      // 编辑类型入口， 0是groupArray的点击事件 1是heroArray
      heroEditChannel: 0,
      // heroGroup选中的index
      heroArraySelectIndex: 0,
      // heroGroup选中的index 第一个元素是第几个数组，第二个元素是数组内的index
      groupArraySelectIndex: [],
      // 是否显示hero编辑框
      heroModal: false,
      // 是否显示导入框
      inputDataModal: false,
      // 是否开启协同
      enableCollaborate: false,
      // 导入的json
      inputJsonData: "",
      rules: reactive({
        account: {
          required: true,
          message: "请输入玩家id",
          trigger: "blur",
        },
        jobType: {
          required: true,
          trigger: "change",
          message: "请选择职业类型",
        },
        reputation: {
          required: true,
          validator: (rule, value) => {
            if (!value) {
              return new Error("需要名望");
            } else if (Number(value) < 0) {
              return new Error("输出不是负数！");
            }
            return true;
          },
          trigger: ["input", "blur"],
        },
      }),
      jobTypeDict: {
        1: "C",
        2: "奶",
        3: "混子",
      },
    };
  },
  setup() {
    const notification = useNotification();
    const { toClipboard } = useClipboard();
    const formRef = reactive(null);
    const message = useMessage();
    return {
      formRef,
      message(msg) {
        message.info(msg);
      },
      error(msg) {
        message.error(msg);
      },
      info() {
        notification.info({
          content: "复制成功,已开启协同",
        });
      },
      warn() {
        notification.warning({
          content: "请选择职业！",
        });
      },
      toClipboard,
    };
  },
  created() {
    // 获取参数
    let queryGuid = router.currentRoute.value.query.guid;
    if (queryGuid) {
      this.guid = queryGuid;
      this.enableCollaborate = true;
      // 初始化websocket
      initWebSocket(this.guid);
    }
  },
  watch: {},
  mounted() {},
  computed: {
    ...mapStores(heroStore),
    groupArray: {
      get() {
        return JSON.parse(JSON.stringify(this.yjsstore.groupArray));
      },
    },
    heroArray: {
      get() {
        return JSON.parse(JSON.stringify(this.yjsstore.heroArray));
      },
    },
    /**
     * 获取分享地址
     * @returns {string}
     */
    shareUrl() {
      return `${import.meta.env.VITE_HTTP_URL}?guid=${this.guid}`;
    },
  },
  methods: {
    addGroup() {
      this.yjsstore.groupArray.push([]);
    },
    // 保存职业
    saveHero() {
      if (!this.hero.label) {
        this.warn();
        return;
      }
      this.$refs.formRef.validate((errors) => {
        if (!errors) {
          // 编辑状态
          if (this.isEditState) {
            if (this.heroEditChannel === 0) {
              const groupIndex = this.groupArraySelectIndex[0];
              const index = this.groupArraySelectIndex[1];
              this.yjsstore.groupArray[groupIndex].splice(index, 1, this.hero);
            } else if (this.heroEditChannel === 1) {
              // this.heroArray[this.heroArraySelectIndex] = this.hero;
              this.yjsstore.heroArray.splice(
                this.heroArraySelectIndex,
                1,
                this.hero
              );
            }
            this.message("保存成功");
          } else {
            this.yjsstore.heroArray.push(this.hero);
          }
          this.resetHero();
        } else {
          // console.log(errors);
          this.error("验证失败");
        }
      });
    },
    resetHero() {
      this.isEditState = false;
      this.hero = {};
      this.heroModal = false;
    },
    clickHero(index, data) {
      this.heroArraySelectIndex = index;
      this.heroEditChannel = 1;
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
    groupClickHero(index, gIndex, data) {
      this.groupArraySelectIndex = [index, gIndex];
      this.heroEditChannel = 0;
      this.hero = { ...this.hero, ...data };
      this.isEditState = true;
      this.heroModal = true;
    },
    doInputJsonData() {
      let json = JSON.parse(this.inputJsonData);
      this.yjsstore.heroArray.splice(0, this.yjsstore.heroArray.length);
      this.yjsstore.groupArray.splice(0, this.yjsstore.groupArray.length);
      json.heroArray.forEach((e) => {
        this.yjsstore.heroArray.push(e);
      });
      json.groupArray.forEach((e) => {
        this.yjsstore.groupArray.push(e);
      });
      this.inputDataModal = false;
    },
    exportData() {
      const _heroArray = JSON.parse(JSON.stringify(this.yjsstore.heroArray));
      const _groupArray = JSON.parse(JSON.stringify(this.yjsstore.groupArray));
      this.heroStore.exportJsonData(_heroArray, _groupArray);
    },
    resetInputJob() {
      this.heroStore.resetData();
    },
    toGithub() {
      window.location.href = "";
    },
    /**
     * 队伍列表拖动变化事件
     * @param index
     * @param event
     */
    groupArrayChange(index, event) {
      // console.log("groupArrayChange", event, index);
      if (event.added) {
        // console.log("added");
        const newIndex = event.added.newIndex;
        const element = event.added.element;
        this.yjsstore.groupArray[index].splice(newIndex, 0, element);
      }
      if (event.removed) {
        // console.log("removed");
        const oldIndex = event.removed.oldIndex;
        this.yjsstore.groupArray[index].splice(oldIndex, 1);
      }
      if (event.moved) {
        // console.log("moved");
        const newIndex = event.moved.newIndex;
        const oldIndex = event.moved.oldIndex;
        const newData = JSON.parse(
          JSON.stringify(this.yjsstore.groupArray[index][newIndex])
        );
        const oldData = JSON.parse(
          JSON.stringify(this.yjsstore.groupArray[index][oldIndex])
        );
        // console.log("newData", newData);
        // console.log("oldData", oldData);
        this.yjsstore.groupArray[index].splice(newIndex, 1, oldData);
        this.yjsstore.groupArray[index].splice(oldIndex, 1, newData);
      }

      //
      // this.heroStore.saveLocalStorage();
    },
    /**
     * 职业列表拖动变化事件
     * @param event
     */
    heroArrayChange(event) {
      // console.log("heroArrayChange", event);
      if (event.added) {
        // console.log("added");
        const newIndex = event.added.newIndex;
        const element = event.added.element;
        this.yjsstore.heroArray.splice(newIndex, 0, element);
        // console.log("removed");
      }
      if (event.removed) {
        const oldIndex = event.removed.oldIndex;
        this.yjsstore.heroArray.splice(oldIndex, 1);
        // console.log("removed");
      }
      if (event.moved) {
        // console.log("moved");
        const newIndex = event.moved.newIndex;
        const oldIndex = event.moved.oldIndex;
        const newData = JSON.parse(
          JSON.stringify(this.yjsstore.heroArray[newIndex])
        );
        const oldData = JSON.parse(
          JSON.stringify(this.yjsstore.heroArray[oldIndex])
        );
        // console.log("newData", newData);
        // console.log("oldData", oldData);
        this.yjsstore.heroArray.splice(newIndex, 1, oldData);
        this.yjsstore.heroArray.splice(oldIndex, 1, newData);
      }
    },
    generateGuid() {
      this.guid = this.heroStore.guid();
    },
    /**
     * 生成分享的url
     */
    generateShareUrl() {
      this.toClipboard(this.shareUrl);
      this.info();
      // 设置缓存
      const groupArray = JSON.parse(JSON.stringify(this.yjsstore.groupArray));
      const heroArray = JSON.parse(JSON.stringify(this.yjsstore.heroArray));
      this.heroStore.save(heroArray, groupArray);
      // 初始化websocket
      initWebSocket(this.guid);
      this.enableCollaborate = true;
      // window.location.href = window.location.href + "?guid=" + this.guid;
      this.$router.push({ path: "/", query: { guid: this.guid } });
      // 同步现有数据到房间
    },
    /**
     * 生成职业描述
     * @param element
     * @returns {string}
     */
    jobText(element) {
      if (element.jobType === "1") {
        return `职业:${element.label}(${this.jobTypeDict[element.jobType]},${
          element.reputation
        })`;
      }
      if (element.jobType === "2") {
        return `职业:${element.label}(${this.jobTypeDict[element.jobType]},${
          element.reputation
        })`;
      }
      if (element.jobType === "3") {
        return `职业:${element.label}(${this.jobTypeDict[element.jobType]})`;
      }
    },
    /**
     * 生成伤害描述
     * @param element
     * @returns {string}
     */
    dpsText(element) {
      if (element.jobType === "1") {
        return `伤害: ${element.dps}亿`;
      }
      if (element.jobType === "2") {
        return `三攻: ${element.sangong} 力智: ${element.lizhi}`;
      }
      if (element.jobType === "3") {
        return `开始滑水`;
      }
    },
  },
});
</script>

<style scoped="scoped">
@import "home.css";
</style>
