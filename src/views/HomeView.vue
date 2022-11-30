<template>
  <div class="idx">
    <n-grid cols="3" item-responsive responsive="screen">
      <n-grid-item span="0 m:1 l:2">
        <div class="light-green">
          <div
            v-for="(item, index) in groupArray"
            :key="index"
            class="group-box"
          >
            <span class="troops">队伍{{ index + 1 }}信息</span>
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
                    <n-gradient-text class="renown" type="info">
                      职业: {{ element.label }}
                    </n-gradient-text>
                    <br />
                    <n-gradient-text class="idCard" type="error">
                      id: {{ element.account }}
                    </n-gradient-text>
                    <br />
                    <n-gradient-text class="job-item">
                      名望: {{ element.reputation }}
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
                    职业: {{ element.label }}
                  </n-gradient-text>
                  <br />
                  <n-gradient-text class="idCard" type="error">
                    id: {{ element.account }}
                  </n-gradient-text>
                  <br />
                  <n-gradient-text class="job-item">
                    名望: {{ element.reputation }}
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
                  v-show="!guid"
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
            <p>暂时只支持`职业列表`的修改和删除</p>
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
import { useNotification } from "naive-ui";

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
      inputJsonData: "",
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
    const notification = useNotification();
    const { toClipboard } = useClipboard();
    return {
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
    console.log("queryGuid: " + queryGuid);
    if (queryGuid) {
      this.guid = queryGuid;
      // 初始化websocket
      initWebSocket(this.guid);
    }
    // this.groupArray = yjsstore.groupArray;
    // this.heroArray = yjsstore.heroArray;
  },
  watch: {},
  mounted() {},
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
    shareUrl() {
      return import.meta.env.VITE_HTTP_URL + "?guid=" + this.guid;
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
    doInputJsonData() {
      this.heroStore.inputJsonData(this.inputJsonData);
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
    generateGuid() {
      this.guid = this.heroStore.guid();
    },
    /**
     * 生成分享的url
     */
    generateShareUrl() {
      // this.guid = this.heroStore.guid();
      // const url = import.meta.env.VITE_HTTP_URL + "?guid=" + this.guid;
      // console.log(url);
      this.toClipboard(this.shareUrl);
      this.info();
      // 设置缓存
      const groupArray = JSON.parse(JSON.stringify(this.yjsstore.groupArray));
      const heroArray = JSON.parse(JSON.stringify(this.yjsstore.heroArray));
      this.heroStore.save(heroArray, groupArray);
      // 初始化websocket
      initWebSocket(this.guid);
      // window.location.href = window.location.href + "?guid=" + this.guid;
      this.$router.push({ path: "/", query: { guid: this.guid } });

      // 同步现有数据到房间
    },
  },
});
</script>

<style scoped="scoped">
.idx {
  background: url("@/assets/avatar/background.jpg") fixed no-repeat 100% 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.light-green {
  background-color: rgba(0, 0, 0, 0.5);
}
.green {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  width: 30%;
  height: 100%;
}

.group-box {
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}
.group-draggable {
  padding: 10px;
  height: 160px;
  display: flex;
  border: 2px solid #0ae642;
}
.hero-box {
  min-height: 300px;
  display: flex;
  border: 2px solid #0ae642;
  margin-right: 20px;
}
.troops {
  font-size: 22px;
  color: chartreuse;
  /* text-shadow: 0 0 0.5em #0ae642, 0 0 0.2em #5c5c5c; */
  letter-spacing: 0.2rem;
}
.btn-box button {
  margin: 10px 5px;
}
.words {
  padding: 30px;
  position: fixed;
  bottom: 10%;
  letter-spacing: 0.2rem;
  font-size: 1.5rem;
  background-image: -webkit-linear-gradient(
    left,
    chartreuse,
    darkorange 25%,
    chartreuse 50%,
    darkorange 75%,
    chartreuse
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  z-index: -1;
}
.github {
  -webkit-text-fill-color: limegreen;
}
.btn-box button,
.btn-box button:focus {
  opacity: 0.9;
  color: chartreuse;
  background-color: transparent;
}
/deep/.n-input-wrapper {
  -webkit-text-fill-color: darkcyan;
}
.renown {
  color: chartreuse;
}
.idCard {
  color: darkorange;
}
.job-item {
  color: greenyellow;
}
.list-group-item {
  padding: 10px;
}
</style>
