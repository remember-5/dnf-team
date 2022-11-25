<template>
  <div class="row">
    <div class="col-4">
      <h3>队伍信息1</h3>

      <draggable
        id="first"
        data-source="juju"
        :list="list1"
        class="list-group"
        group="a"
        item-key="name"
      >
        <template #item="{ element }">
          <div class="list-group-item">
            <n-avatar :size="48" :src="element.avatar" />
            {{ element.name }}
          </div>
        </template>
        <template #footer>
          <div class="btn-group list-group-item" role="group">
            <button class="btn btn-secondary" @click="add">Add</button>
            <button class="btn btn-secondary" @click="replace">Replace</button>
          </div>
        </template>
      </draggable>
    </div>

    <div class="col-4">
      <h3>队伍信息2</h3>

      <draggable
        id="first"
        data-source="juju"
        :list="list2"
        class="list-group"
        group="a"
        item-key="name"
      >
        <template #item="{ element }">
          <div class="list-group-item">
            <n-avatar :size="48" :src="element.avatar" />
            {{ element.name }}
          </div>
        </template>

        <template #footer>
          <div class="btn-group list-group-item" role="group">
            <button class="btn btn-secondary" @click="add">Add</button>
            <button class="btn btn-secondary" @click="replace">Replace</button>
          </div>
        </template>
      </draggable>
    </div>

    <div class="col-4">
      <h3>职业列表</h3>

      <draggable :list="list3" class="list-group" group="a" item-key="name">
        <template #item="{ element }">
          <div class="list-group-item item">
            <n-avatar :size="48" :src="element.avatar" />
            {{ element.name }}
          </div>
        </template>

        <template #header>
          <div
            class="btn-group list-group-item"
            role="group"
            aria-label="Basic example"
          >
            <button class="btn btn-secondary" @click="add2">Add</button>
            <button class="btn btn-secondary" @click="replace2">Replace</button>
          </div>
        </template>
      </draggable>
    </div>

    <rawDisplayer class="col-2" :value="list1" title="List" />

    <rawDisplayer class="col-2" :value="list2" title="List2" />

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
          :label-width="80"
          :model="formValue"
          label-placement="left"
          :rules="rules"
          :style="{
            maxWidth: '640px',
          }"
        >
          <n-form-item label="账号" path="user.name">
            <n-tree-select
              :options="jobs"
              default-value="Drive My Car"
              @update:value="updateJob"
            />
          </n-form-item>
          <n-form-item label="账号" path="user.name">
            <n-input
              v-model:value="formValue.user.name"
              placeholder="输入账号"
            />
          </n-form-item>
          <n-form-item label="名望" path="user.name">
            <n-input
              v-model:value="formValue.user.name"
              placeholder="输入名望"
            />
          </n-form-item>
          <n-form-item label="伤害" path="user.age">
            <n-input
              v-model:value="formValue.user.age"
              placeholder="输入伤害"
            />
          </n-form-item>
        </n-form>
      </div>
      <template #action>
        <n-button attr-type="button" @click="handleValidateClick">
          保存
        </n-button>
      </template>
    </n-modal>
  </div>
</template>
<script>
import { defineComponent, reactive } from "vue";
import {
  NAvatar,
  NModal,
  NForm,
  NFormItem,
  NButton,
  NInput,
  NTreeSelect,
} from "naive-ui";

import draggable from "vuedraggable";
let id = 1;
export default defineComponent({
  name: "two-list-headerslots",
  display: "Two list header slot",
  order: 14,
  components: {
    draggable,
    NAvatar,
    NModal,
    NForm,
    NFormItem,
    NButton,
    NInput,
    NTreeSelect,
  },
  data() {
    return {
      jobs: [
        {
          key: 100,
          label: "男鬼剑",
          children: [
            {
              key: 101,
              label: "剑魂",
              avatar: require("@/assets/avatar/1.png"),
            },
            {
              key: 102,
              label: "红狗",
              avatar: require("@/assets/avatar/1.png"),
            },
          ],
        },
      ],
      showModal: false,
      formValue: reactive({
        user: {
          name: "",
          age: "",
        },
        phone: "",
      }),
      rules: reactive({
        user: {
          name: {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          age: {
            required: true,
            message: "请输入年龄",
            trigger: ["input", "blur"],
          },
        },
        phone: {
          required: true,
          message: "请输入电话号码",
          trigger: ["input"],
        },
      }),
      list1: [],
      list2: [],
      list3: [
        { name: "刃影", id: 3, avatar: require("@/assets/avatar/1.png") },
      ],
    };
  },
  methods: {
    add() {
      this.list1.push({ name: "Juan " + id, id: id++ });
    },
    replace() {
      this.list1 = [{ name: "Edgard", id: id++ }];
    },
    add2() {
      this.showModal = true;
      // this.list3.push({ name: "Juan " + id, id: id++ });
    },
    replace2() {
      this.list3 = [{ name: "Edgard", id: id++ }];
    },
    onPositiveClick() {},
    onNegativeClick() {},
    handleValidateClick() {},
    updateJob(value, option) {
      console.log(value, option);
    },
  },
});
</script>
<style scoped></style>
<style>
.job-box {
  width: 300px;
}
</style>
